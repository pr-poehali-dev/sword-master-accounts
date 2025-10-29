'''
Business: Authentication API for user registration, login, and session management
Args: event - dict with httpMethod, body, headers; context - object with request_id
Returns: HTTP response with JWT token or error
'''

import json
import os
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get('DATABASE_URL')

def create_token(user_id: int, email: str, role: str) -> str:
    expiry = int((datetime.now() + timedelta(days=30)).timestamp())
    payload = f"{user_id}:{email}:{role}:{expiry}"
    secret = os.environ.get('JWT_SECRET', 'sword-master-secret-key-2024')
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    token = base64.b64encode(f"{payload}:{signature}".encode()).decode()
    return token

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        decoded = base64.b64decode(token.encode()).decode()
        parts = decoded.split(':')
        if len(parts) != 5:
            return None
        
        user_id, email, role, expiry, signature = parts
        payload = f"{user_id}:{email}:{role}:{expiry}"
        secret = os.environ.get('JWT_SECRET', 'sword-master-secret-key-2024')
        expected_signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        
        if signature != expected_signature:
            return None
        
        if int(expiry) < int(datetime.now().timestamp()):
            return None
        
        return {'user_id': int(user_id), 'email': email, 'role': role}
    except:
        return None

def hash_password(password: str) -> str:
    salt = os.environ.get('PASSWORD_SALT', 'sword-master-salt')
    return hashlib.sha256((password + salt).encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email')
                password = body.get('password')
                username = body.get('username')
                role = body.get('role', 'user')
                
                if not email or not password or not username:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Email, password and username are required'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cursor.execute(
                    "INSERT INTO users (email, password_hash, username, role) VALUES (%s, %s, %s, %s) RETURNING id, email, username, role",
                    (email, password_hash, username, role)
                )
                user = cursor.fetchone()
                conn.commit()
                
                token = create_token(user['id'], user['email'], user['role'])
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'email': user['email'],
                            'username': user['username'],
                            'role': user['role']
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                email = body.get('email')
                password = body.get('password')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Email and password are required'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cursor.execute(
                    "SELECT id, email, username, role FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                token = create_token(user['id'], user['email'], user['role'])
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'email': user['email'],
                            'username': user['username'],
                            'role': user['role']
                        }
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            token = event.get('headers', {}).get('x-auth-token') or event.get('headers', {}).get('X-Auth-Token')
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Token required'}),
                    'isBase64Encoded': False
                }
            
            user_data = verify_token(token)
            
            if not user_data:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid token'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "SELECT id, email, username, role, avatar_url, rating, total_sales, balance FROM users WHERE id = %s",
                (user_data['user_id'],)
            )
            user = cursor.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'user': dict(user)}),
                'isBase64Encoded': False
            }
    
    except psycopg2.IntegrityError:
        conn.rollback()
        return {
            'statusCode': 409,
            'headers': headers,
            'body': json.dumps({'error': 'User already exists'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
