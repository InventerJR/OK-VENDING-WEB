export function formatPrice(price) {
    const roundedPrice = Math.ceil(price * 100) / 100;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(roundedPrice);
  }