'''
Business: Reviews API for fetching and managing customer reviews
Args: event - dict with httpMethod, queryStringParameters; context - object with request_id
Returns: HTTP response with reviews list or error
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get('DATABASE_URL')

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
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            limit = int(params.get('limit', 10))
            
            cursor.execute("""
                SELECT 
                    r.id,
                    r.rating,
                    r.comment,
                    r.is_verified,
                    r.created_at,
                    u.username,
                    u.avatar_url
                FROM reviews r
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.listing_id IS NULL
                ORDER BY r.created_at DESC
                LIMIT %s
            """, (limit,))
            
            reviews = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'reviews': [dict(review) for review in reviews]
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            user_id = body.get('user_id', 1)
            seller_id = body.get('seller_id', 1)
            rating = body.get('rating')
            comment = body.get('comment')
            
            if not rating or not comment:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Rating and comment are required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                INSERT INTO reviews (user_id, seller_id, rating, comment, is_verified)
                VALUES (%s, %s, %s, %s, true)
                RETURNING id
            """, (user_id, seller_id, rating, comment))
            
            review_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'id': review_id, 'message': 'Review created'}),
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
