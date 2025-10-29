'''
Business: Listings API for managing account listings (CRUD operations)
Args: event - dict with httpMethod, body, queryStringParameters; context - object with request_id
Returns: HTTP response with listings data or error
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            listing_id = params.get('id')
            
            if listing_id:
                cursor.execute("""
                    SELECT 
                        l.*,
                        u.username as seller_name,
                        u.rating as seller_rating
                    FROM listings l
                    LEFT JOIN users u ON l.seller_id = u.id
                    WHERE l.id = %s
                """, (listing_id,))
                listing = cursor.fetchone()
                
                if not listing:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Listing not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'listing': dict(listing)}, default=str),
                    'isBase64Encoded': False
                }
            
            status = params.get('status', 'active')
            rarity = params.get('rarity')
            sort_by = params.get('sort', 'created_at')
            limit = int(params.get('limit', 20))
            
            query = """
                SELECT 
                    l.*,
                    u.username as seller_name,
                    u.rating as seller_rating
                FROM listings l
                LEFT JOIN users u ON l.seller_id = u.id
                WHERE l.status = %s
            """
            query_params = [status]
            
            if rarity:
                query += " AND l.rarity = %s"
                query_params.append(rarity)
            
            query += f" ORDER BY l.{sort_by} DESC LIMIT %s"
            query_params.append(limit)
            
            cursor.execute(query, query_params)
            listings = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'listings': [dict(listing) for listing in listings]
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            required_fields = ['title', 'level', 'power', 'price', 'rarity']
            for field in required_fields:
                if field not in body:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': f'{field} is required'}),
                        'isBase64Encoded': False
                    }
            
            seller_id = body.get('seller_id', 1)
            
            cursor.execute("""
                INSERT INTO listings 
                (seller_id, title, description, level, power, price, image_url, rarity, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                seller_id,
                body['title'],
                body.get('description', ''),
                body['level'],
                body['power'],
                body['price'],
                body.get('image_url', ''),
                body['rarity'],
                body.get('status', 'moderation')
            ))
            
            listing_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'id': listing_id, 'message': 'Listing created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            listing_id = body.get('id')
            
            if not listing_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Listing ID is required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            update_values = []
            
            allowed_fields = ['title', 'description', 'level', 'power', 'price', 'image_url', 'rarity', 'status']
            for field in allowed_fields:
                if field in body:
                    update_fields.append(f"{field} = %s")
                    update_values.append(body[field])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            update_values.append(listing_id)
            query = f"UPDATE listings SET {', '.join(update_fields)}, updated_at = NOW() WHERE id = %s"
            
            cursor.execute(query, update_values)
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Listing updated'}),
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
