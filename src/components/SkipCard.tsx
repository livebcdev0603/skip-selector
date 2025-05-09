import React from 'react';
import { Card, Typography, Box, Chip } from '@mui/material';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { Skip } from '../types/skip';
import skipImage from '../assets/skip-placeholder.jpg';
import skipNoRoad from '../assets/skip-no-road.jpg';
import skipNoHeavy from '../assets/skip-no-heavy.jpg';
import skipBothRestricted from '../assets/skip-both-restricted.jpg';

interface SkipCardProps {
  skip: Skip;
  isSelected: boolean;
  onClick: () => void;
}

const ACCENT = '#3b82f6';
const CARD_BG = '#23272f';

const CardRoot = styled(Card)<{ $isSelected: boolean }>`
  width: 100%;
  max-width: 350px;
  border-radius: 16px;
  background: ${CARD_BG};
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  border: 2.5px solid ${p => p.$isSelected ? ACCENT : 'transparent'};
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.18s, border 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.14);
    transform: translateY(-2px) scale(1.018);
  }
`;

const ImageBox = styled(Box)`
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  border-radius: 14px 14px 0 0;
  background: #222;
`;

const SkipImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const SizeBadge = styled(Chip)`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${ACCENT} !important;
  color: #fff !important;
  font-weight: 700;
  font-size: 1.05rem;
`;

const TickOverlay = styled(Box)`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  background: ${ACCENT};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.18);
`;

const InfoSection = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 2rem 1rem 1rem 1rem;
  align-items: flex-start;
`;

const SkipTitle = styled(Typography)`
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5em;
`;

const Price = styled(Typography)`
  font-size: 1.45rem;
  font-weight: 800;
  color: ${ACCENT};
  margin-bottom: 0.4em;
`;

const HirePeriod = styled(Typography)`
  font-size: 1rem;
  color: #b0b8c1;
  margin-bottom: 1.1em;
`;

const BadgesRow = styled(Box)`
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  align-items: flex-start;
`;

const BadgeBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.4em;
  background: rgba(30,41,59,0.85);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.18em 0.7em;
  margin-bottom: 0.1em;
`;

const getSkipThumbnail = (skip: Skip) => {
  const notAllowedOnRoad = !skip.allowed_on_road;
  const noHeavyWaste = !skip.allows_heavy_waste;
  if (notAllowedOnRoad && noHeavyWaste) return skipBothRestricted;
  if (notAllowedOnRoad) return skipNoRoad;
  if (noHeavyWaste) return skipNoHeavy;
  return skipImage;
};

const SkipCard: React.FC<SkipCardProps> = ({ skip, isSelected, onClick }) => {
  const totalPrice = skip.price_before_vat + (skip.price_before_vat * skip.vat / 100);
  const showNotAllowedOnRoad = !skip.allowed_on_road;
  const showNoHeavyWaste = !skip.allows_heavy_waste;
  const thumbnail = getSkipThumbnail(skip);

  return (
    <CardRoot $isSelected={isSelected} elevation={isSelected ? 8 : 2} onClick={onClick} tabIndex={0} role="button" aria-pressed={isSelected}>
      <ImageBox>
        <SkipImg src={thumbnail} alt={`${skip.size} yard skip`} />
        <SizeBadge label={`${skip.size} Yards`} size="small" />
        {(showNotAllowedOnRoad || showNoHeavyWaste) && (
          <BadgesRow>
            {showNotAllowedOnRoad && (
              <BadgeBox>
                <InfoOutlinedIcon sx={{ fontSize: 16, color: '#fff', mr: 0.5 }} />
                Not Allowed On The Road
              </BadgeBox>
            )}
            {showNoHeavyWaste && (
              <BadgeBox>
                <InfoOutlinedIcon sx={{ fontSize: 16, color: '#fff', mr: 0.5 }} />
                No Heavy Waste
              </BadgeBox>
            )}
          </BadgesRow>
        )}
        {isSelected && (
          <TickOverlay>
            <CheckCircleIcon sx={{ color: '#fff', fontSize: 28 }} />
          </TickOverlay>
        )}
      </ImageBox>
      <InfoSection>
        <SkipTitle>{skip.size} Yard Skip</SkipTitle>
        <Price>£{totalPrice.toFixed(2)}</Price>
        <HirePeriod>{skip.hire_period_days} day hire period</HirePeriod>
      </InfoSection>
    </CardRoot>
  );
};

export default SkipCard; 