import React from 'react';
import './PriceCard.css';

const PriceCard = ({
  label = 'PRECIO ÚNICO DE LA TARJETA',
  price = '$ 3.000',
  backgroundImage = 'https://independencia.bizland.tech/hubfs/lp-independencia/Exagono.Imagen.Tarjeta.IND.png',
}) => {
  return (
    <div className="price-card">
      <div className="price-card__content">
        <p className="price-card__label">{label}</p>
        <p className="price-card__price">{price}</p>
      </div>

      <div
        className="price-card__image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default PriceCard;