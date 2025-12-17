"""Test the complete login API flow"""
import requests

def test_login_api():
    url = "http://localhost:8000/api/auth/login"
    
    # OAuth2 form data
    data = {
        "username": "admin@scolarix.com",
        "password": "password"
    }
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    print("Testing login API...")
    print(f"URL: {url}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, data=data, headers=headers)
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("\n✅ Login SUCCESSFUL!")
            json_data = response.json()
            print(f"Token: {json_data.get('access_token', 'N/A')[:50]}...")
            print(f"User: {json_data.get('user', {})}")
        else:
            print(f"\n❌ Login FAILED with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_login_api()
