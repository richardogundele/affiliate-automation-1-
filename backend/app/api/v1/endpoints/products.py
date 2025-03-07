from fastapi import APIRouter, HTTPException
from pytrends.request import TrendReq
from typing import Optional
from pydantic import BaseModel
import pandas as pd

router = APIRouter()
pytrends = TrendReq(hl='en-US', tz=360)

class ProductAnalysis(BaseModel):
    name: str
    description: Optional[str] = None

@router.post("/analyze")
async def analyze_product(product: ProductAnalysis):
    try:
        # Get Google Trends data
        kw_list = [product.name]
        pytrends.build_payload(kw_list, timeframe='today 12-m')
        
        # Get interest over time
        interest_over_time_df = pytrends.interest_over_time()
        
        # Convert to list of dictionaries for the frontend
        trends_data = []
        if not interest_over_time_df.empty:
            for index, row in interest_over_time_df.iterrows():
                trends_data.append({
                    "date": index.strftime("%Y-%m-%d"),
                    "interest": int(row[product.name])
                })
        
        # Calculate average interest
        avg_interest = (
            interest_over_time_df[product.name].mean() 
            if not interest_over_time_df.empty else 0
        )
        
        # Determine demand level
        demand_level = "High" if avg_interest >= 75 else "Medium" if avg_interest >= 40 else "Low"
        
        return {
            "name": product.name,
            "description": product.description,
            "demand": demand_level,
            "trendsData": trends_data,
            "averageInterest": avg_interest
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

