from datetime import datetime
from sqlalchemy.orm import Session
from . import database as db
import uuid

# Product operations
def create_product(db: Session, product_data: dict):
    product = db.Product(
        id=str(uuid.uuid4()),
        **product_data
    )
    db.session.add(product)
    db.session.commit()
    db.session.refresh(product)
    return product

def get_product(db: Session, product_id: str):
    return db.session.query(db.Product).filter(db.Product.id == product_id).first()

# Campaign operations
def create_campaign(db: Session, campaign_data: dict):
    campaign = db.Campaign(
        id=str(uuid.uuid4()),
        **campaign_data
    )
    db.session.add(campaign)
    db.session.commit()
    db.session.refresh(campaign)
    return campaign

def update_campaign(db: Session, campaign_id: str, updates: dict):
    campaign = db.session.query(db.Campaign).filter(db.Campaign.id == campaign_id).first()
    if campaign:
        for key, value in updates.items():
            setattr(campaign, key, value)
        campaign.updated_at = datetime.utcnow()
        db.session.commit()
        db.session.refresh(campaign)
    return campaign

# Scheduled Post operations
def create_scheduled_post(db: Session, post_data: dict):
    post = db.ScheduledPost(
        id=str(uuid.uuid4()),
        **post_data
    )
    db.session.add(post)
    db.session.commit()
    db.session.refresh(post)
    return post

def get_scheduled_posts(db: Session, filters: dict = None):
    query = db.session.query(db.ScheduledPost)
    
    if filters:
        if filters.get('product_id'):
            query = query.filter(db.ScheduledPost.product_id == filters['product_id'])
        if filters.get('status'):
            query = query.filter(db.ScheduledPost.status == filters['status'])
    
    return query.all()

def update_scheduled_post(db: Session, post_id: str, updates: dict):
    post = db.session.query(db.ScheduledPost).filter(db.ScheduledPost.id == post_id).first()
    if post:
        for key, value in updates.items():
            setattr(post, key, value)
        post.updated_at = datetime.utcnow()
        db.session.commit()
        db.session.refresh(post)
    return post

def delete_scheduled_post(db: Session, post_id: str):
    post = db.session.query(db.ScheduledPost).filter(db.ScheduledPost.id == post_id).first()
    if post:
        db.session.delete(post)
        db.session.commit()
    return True 