import { Fyo } from 'fyo';

export type TaxType = 'GST' | 'Exempt';

export async function createIndianRecords(fyo: Fyo) {
  await createTaxes(fyo);
}

async function createTaxes(fyo: Fyo) {
  const GSTs = {
    GST: [28, 18, 12, 6, 5, 3, 0.25, 0],
    'Exempt': [0],
  };

  for (const type of Object.keys(GSTs)) {
    for (const percent of GSTs[type as TaxType]) {
      const name = `${type}-${percent}`;
      const details = getTaxDetails(type as TaxType, percent);

      const newTax = fyo.doc.getNewDoc('Tax', { name, details });
      await newTax.sync();
    }
  }
}

function getTaxDetails(type: TaxType, percent: number) {
  if (type === 'Exempt') {
    return [
      {
        taxType: 'CGST',
        account: 'CGST',
        rate: 0,
      },
      {
        taxType: 'SGST',
        account: 'SGST',
        rate: 0,
      },
      {
        taxType: 'IGST',
        account: 'IGST',
        rate: 0,
      },
    ];
  }

  // For GST, create all three components: CGST, SGST, and IGST
  // CGST and SGST are half of the total rate (for intra-state)
  // IGST is the full rate (for inter-state)
  return [
    {
      taxType: 'CGST',
      account: 'CGST',
      rate: percent / 2,
    },
    {
      taxType: 'SGST',
      account: 'SGST',
      rate: percent / 2,
    },
    {
      taxType: 'IGST',
      account: 'IGST',
      rate: percent,
    },
  ];
}
