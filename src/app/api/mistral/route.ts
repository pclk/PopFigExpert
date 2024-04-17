import MistralClient from '@mistralai/mistralai';
import { MistralStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const apiKey = process.env.MISTRAL_API_KEY;

// // Assuming we have the following data
// const data = {
//   transactionId: ['T1001', 'T1002', 'T1003', 'T1004', 'T1005'],
//   customerId: ['C001', 'C002', 'C003', 'C002', 'C001'],
//   paymentAmount: [125.50, 89.99, 120.00, 54.30, 210.20],
//   paymentDate: [
//     '2021-10-05', '2021-10-06', '2021-10-07', '2021-10-05', '2021-10-08',
//   ],
//   paymentStatus: ['Paid', 'Unpaid', 'Paid', 'Paid', 'Pending'],
// };

// /**
//  * This function retrieves the payment status of a transaction id.
//  * @param {object} data - The data object.
//  * @param {string} transactionId - The transaction id.
//  * @return {string} - The payment status.
//  */
// function retrievePaymentStatus({ data, transactionId }) {
//   const transactionIndex = data.transactionId.indexOf(transactionId);
//   if (transactionIndex !== -1) {
//     return JSON.stringify({ status: data.paymentStatus[transactionIndex] });
//   } else {
//     return JSON.stringify({ status: 'error - transaction id not found.' });
//   }
// }

// /**
//  * This function retrieves the payment date of a transaction id.
//  * @param {object} data - The data object.
//  * @param {string} transactionId - The transaction id.
//  * @return {string} - The payment date.
//  */
// function retrievePaymentDate({ data, transactionId }) {
//   const transactionIndex = data.transactionId.indexOf(transactionId);
//   if (transactionIndex !== -1) {
//     return JSON.stringify({ status: data.paymentDate[transactionIndex] });
//   } else {
//     return JSON.stringify({ status: 'error - transaction id not found.' });
//   }
// }

// const namesToFunctions = {
//   retrievePaymentStatus: (transactionId) =>
//     retrievePaymentStatus({ data, ...transactionId }),
//   retrievePaymentDate: (transactionId) =>
//     retrievePaymentDate({ data, ...transactionId }),
// };

// const tools = [
//   {
//     type: 'function',
//     function: {
//       name: 'retrievePaymentStatus',
//       description: 'Get payment status of a transaction id',
//       parameters: {
//         type: 'object',
//         required: ['transactionId'],
//         properties: {
//           transactionId: { type: 'string', description: 'The transaction id.' },
//         },
//       },
//     },
//   },
//   {
//     type: 'function',
//     function: {
//       name: 'retrievePaymentDate',
//       description: 'Get payment date of a transaction id',
//       parameters: {
//         type: 'object',
//         required: ['transactionId'],
//         properties: {
//           transactionId: { type: 'string', description: 'The transaction id.' },
//         },
//       },
//     },
//   },
// ];

const client = new MistralClient(apiKey);

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  const model = 'mistral-small-2312';
  let response = await client.chatStream({
    model: model,
    messages: messages,
    // tools: tools,
  });

  // Convert the response into a friendly text-stream. The Mistral client responses are
  // compatible with the Vercel AI SDK MistralStream adapter.
  const stream = MistralStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}