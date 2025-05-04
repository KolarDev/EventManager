module.exports = {
  '/tickets/purchase': {
    post: {
      tags: ['Tickets'],
      summary: 'Purchase a ticket',
      description:
        'Initiates a Paystack transaction for purchasing a specific ticket type for an event.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                eventId: {
                  type: 'string',
                  example: '65f2f39a2bacc827b9c2f0d1',
                },
                ticketType: { type: 'string', example: 'VIP' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Payment initialized successfully',
          content: {
            'application/json': {
              example: {
                status: 'success',
                authorization_url: 'https://checkout.paystack.com/xyz123',
              },
            },
          },
        },
        404: {
          description: 'Event not found or ticket sold out',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Sorry! VIP ticket unavailable or sold out',
              },
            },
          },
        },
      },
    },
  },

  '/tickets/validate': {
    post: {
      tags: ['Tickets'],
      summary: 'Validate a ticket via QR code',
      description: 'Validates a ticket and marks it as used if valid.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                qrCode: {
                  type: 'string',
                  example:
                    'event=MusicFest&type=VIP&user=65fd...&timestamp=17096345',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Ticket validated successfully',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Ticket validated successfully',
                ticket: {
                  _id: '65fdd...',
                  event: '65f2f...',
                  user: '65abc...',
                  type: 'VIP',
                  status: 'used',
                },
              },
            },
          },
        },
        400: {
          description: 'Ticket already used',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Ticket already used !',
              },
            },
          },
        },
        404: {
          description: 'Invalid ticket',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Invalid ticket',
              },
            },
          },
        },
      },
    },
  },

  '/tickets/all-tickets': {
    get: {
      tags: ['Tickets'],
      summary: 'Get all issued tickets',
      description: 'Returns a list of all tickets in the system.',
      responses: {
        200: {
          description: 'A list of tickets',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: {
                  tickets: [
                    {
                      _id: '65fdd...',
                      event: '65f2f...',
                      user: '65abc...',
                      type: 'Regular',
                      status: 'unused',
                      qrCode: 'data:image/png;base64,...',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
