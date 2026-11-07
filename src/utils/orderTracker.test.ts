import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORDER_STAGES,
  getStageIndex,
  calculateTimeline,
  calculateOrderTotals,
  formatAzn,
  validateTransactionId,
} from './orderTracker';
import { OrderItem } from '../types/order';

test('getStageIndex returns correct index for all stages', () => {
  assert.equal(getStageIndex('sifaris_alindi'), 0);
  assert.equal(getStageIndex('hazirlanir'), 1);
  assert.equal(getStageIndex('istehsalda'), 2);
  assert.equal(getStageIndex('gonderilib'), 3);
  assert.equal(getStageIndex('tehvil_verilib'), 4);
});

test('calculateTimeline marks completed and current stages accurately', () => {
  const timelineAtHazirlanir = calculateTimeline('hazirlanir');
  assert.equal(timelineAtHazirlanir.length, 5);
  // Stage 0 (sifaris_alindi) should be completed, not current
  assert.equal(timelineAtHazirlanir[0].completed, true);
  assert.equal(timelineAtHazirlanir[0].current, false);
  // Stage 1 (hazirlanir) should be completed AND current
  assert.equal(timelineAtHazirlanir[1].completed, true);
  assert.equal(timelineAtHazirlanir[1].current, true);
  // Stage 2 (istehsalda) should not be completed and not current
  assert.equal(timelineAtHazirlanir[2].completed, false);
  assert.equal(timelineAtHazirlanir[2].current, false);
});

test('calculateOrderTotals correctly computes subtotal, discounts and totals', () => {
  const mockItems: OrderItem[] = [
    {
      id: 'item-1',
      name: 'Bant naxışlı qız uşağı geyim dəsti (3-lü)',
      category: 'Uşaq geyimləri',
      sellerName: "Elnur660's Store 7932",
      sellerId: '7932',
      sellerRating: 4.9,
      sellerVerified: true,
      price: 10.87,
      quantity: 1,
      attributes: {
        size: '1-2 yaş',
        color: 'Çəhrayı & Ağ',
        pieceCount: '3-lü dəst',
      },
      sku: 'GEY-KID-1087',
    },
  ];

  const totals = calculateOrderTotals(mockItems, 0, 0);
  assert.equal(totals.subtotal, 10.87);
  assert.equal(totals.total, 10.87);
  assert.equal(totals.itemCount, 1);
  assert.equal(formatAzn(totals.total), '10.87 ₼');
});

test('validateTransactionId checks wallet and order id formats', () => {
  assert.equal(validateTransactionId('wallet-payment-09abdd31'), true);
  assert.equal(validateTransactionId('d22b7225-2586-4353-b943-356b73ef59f3'), true);
});
