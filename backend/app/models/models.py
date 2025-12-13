from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database.config import Base
import enum

class Squad(Base):
    __tablename__ = "squads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    season = Column(Integer, nullable=False)

    quarterbacks = relationship("Quarterback", back_populates="squad")

class Quarterback(Base):
    __tablename__ = "quarterbacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    nfl_team = Column(String, nullable=False)
    squad_id = Column(Integer, ForeignKey("squads.id"), nullable=True)
    season = Column(Integer, nullable=False)

    squad = relationship("Squad", back_populates="quarterbacks")
    weekly_stats = relationship("WeeklyStat", back_populates="quarterback")
    season_bonuses = relationship("SeasonBonus", back_populates="quarterback")
    playoff_appearances = relationship("PlayoffAppearance", back_populates="quarterback")

class WeeklyStat(Base):
    __tablename__ = "weekly_stats"

    id = Column(Integer, primary_key=True, index=True)
    qb_id = Column(Integer, ForeignKey("quarterbacks.id"), nullable=False)
    week = Column(Integer, nullable=False)
    season = Column(Integer, nullable=False)
    passing_yards = Column(Integer, default=0)
    rushing_yards = Column(Integer, default=0)
    passing_tds = Column(Integer, default=0)
    rushing_tds = Column(Integer, default=0)
    receiving_tds = Column(Integer, default=0)
    interceptions = Column(Integer, default=0)
    fumbles = Column(Integer, default=0)
    game_won = Column(Boolean, default=False)
    prime_time_win = Column(Boolean, default=False)
    points = Column(Float, default=0.0)

    quarterback = relationship("Quarterback", back_populates="weekly_stats")

class BonusType(str, enum.Enum):
    MVP = "MVP"
    MVP_RUNNER_UP = "MVP_RUNNER_UP"
    MVP_3RD = "MVP_3RD"
    MVP_4TH = "MVP_4TH"
    MVP_5TH = "MVP_5TH"
    ROOKIE_OF_YEAR = "ROOKIE_OF_YEAR"
    CONF_POW = "CONF_POW"
    CONF_POM = "CONF_POM"

class SeasonBonus(Base):
    __tablename__ = "season_bonuses"

    id = Column(Integer, primary_key=True, index=True)
    qb_id = Column(Integer, ForeignKey("quarterbacks.id"), nullable=False)
    season = Column(Integer, nullable=False)
    bonus_type = Column(Enum(BonusType), nullable=False)
    points = Column(Float, nullable=False)

    quarterback = relationship("Quarterback", back_populates="season_bonuses")

class PlayoffRound(str, enum.Enum):
    WILD_CARD = "WILD_CARD"
    DIVISIONAL = "DIVISIONAL"
    CONF_CHAMPIONSHIP = "CONF_CHAMPIONSHIP"
    SUPER_BOWL = "SUPER_BOWL"

class PlayoffAppearance(Base):
    __tablename__ = "playoff_appearances"

    id = Column(Integer, primary_key=True, index=True)
    qb_id = Column(Integer, ForeignKey("quarterbacks.id"), nullable=False)
    season = Column(Integer, nullable=False)
    round = Column(Enum(PlayoffRound), nullable=False)
    won_super_bowl = Column(Boolean, default=False)
    points = Column(Float, nullable=False)

    quarterback = relationship("Quarterback", back_populates="playoff_appearances")
