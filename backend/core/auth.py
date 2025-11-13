import asyncio
from database.models import User, async_session, init_db
from sqlalchemy import select, func, or_

async def login_user(email: str, password: str):
    async with async_session() as session:
        try:
            user = await session.scalar(select(User).where(or_(func.lower(User.username) == func.lower(email),func.lower(User.email) == func.lower(email))))
            
            if user:
                if user.password == password:
                    return True, 'Добро пожаловать!', user
                else:
                    return False, 'Неверный логин или пароль', None
            else:
                return False, 'Неверный логин или пароль', None
                
        except Exception as e:
            return False, f'Ошибка сервера: {str(e)}', None