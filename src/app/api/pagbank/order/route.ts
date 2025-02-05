import { NextResponse } from 'next/server';

const PAGBANK_TOKEN = '2f3a563f-62b6-412b-a171-0464537211e47251bc8941d4844bf55ba9b4e8fd02ec74c4-de65-44b4-8455-719425355351';
const SELLER_EMAIL = 'atimilson95@gmail.com';

export async function POST(request: Request) {
  const { items, shipping, customer } = await request.json();

  try {
    const response = await fetch('https://sandbox.api.pagseguro.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
        'Content-Type': 'application/json',
        'x-idempotency-key': new Date().getTime().toString()
      },
      body: JSON.stringify({
        reference_id: new Date().getTime().toString(),
        customer: {
          email: customer.email,
          name: customer.name,
          tax_id: customer.cpf?.replace(/\D/g, ''),
          phones: [{
            country: '55',
            area: customer.phone.substring(0, 2),
            number: customer.phone.substring(2).replace(/\D/g, '')
          }]
        },
        items: items.map((item: any) => ({
          reference_id: item.Produto?.toString(),
          name: item.Descricao,
          quantity: item.Quantidade,
          unit_amount: Math.round((item.PrecoPromocional || item.Preco || 0) * 100)
        })),
        shipping: {
          address: {
            street: shipping.street,
            number: shipping.number,
            complement: shipping.complement,
            locality: shipping.neighborhood,
            city: shipping.city,
            region_code: shipping.state,
            country: 'BRA',
            postal_code: shipping.zipcode.replace(/\D/g, '')
          }
        },
        charges: [{
          amount: {
            value: Math.round((items.reduce((total: number, item: any) => 
              total + (item.PrecoPromocional || item.Preco || 0) * item.Quantidade, 0) + 
              parseFloat(shipping.valor)) * 100),
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: 1,
            capture: true
          }
        }]
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro PagBank:', error);
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 });
  }
}