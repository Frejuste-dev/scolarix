from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, Table, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base
from datetime import datetime

user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('userID', Integer, ForeignKey('users.userID', ondelete='CASCADE'), primary_key=True),
    Column('roleID', Integer, ForeignKey('roles.roleID', ondelete='CASCADE'), primary_key=True)
)

class Role(Base):
    __tablename__ = "roles"
    
    roleID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)
    
    users = relationship("User", secondary=user_roles, back_populates="roles")

class User(Base):
    __tablename__ = "users"
    
    userID = Column(Integer, primary_key=True, autoincrement=True)
    firstname = Column(String(100), nullable=False)
    lastname = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    isActive = Column(Boolean, default=True)
    createdAt = Column(TIMESTAMP, default=datetime.utcnow)
    deletedAt = Column(TIMESTAMP, nullable=True)
    
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    # student = relationship("Student", back_populates="user", uselist=False)  # TODO: Uncomment when Student model is ready
    # teacher = relationship("Teacher", back_populates="user", uselist=False)  # TODO: Uncomment when Teacher model is ready
    # audit_logs = relationship("AuditLog", back_populates="user")  # TODO: Uncomment when AuditLog model is created

    