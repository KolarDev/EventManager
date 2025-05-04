module.exports = {
  '/events/create-event': {
    post: {
      tags: ['Events'],
      summary: 'Create a new event',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            example: {
              title: 'Tech Conference',
              eventDate: '2025-07-01T10:00:00Z',
              category: 'Technology',
              description: 'A conference for tech enthusiasts',
              Location: {
                type: 'Point',
                coordinates: [9.0578, 7.4951],
              },
              ticketTypes: [
                { name: 'Regular', price: 1000 },
                { name: 'VIP', price: 3000 },
              ],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Event created successfully',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: {
                  newEvent: {
                    _id: '123456',
                    title: 'Tech Conference',
                    // ...
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/events/all-events': {
    get: {
      tags: ['Events'],
      summary: 'Get all events',
      responses: {
        200: {
          description: 'List of all events',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: {
                  events: [
                    /* Array of event objects */
                  ],
                },
              },
            },
          },
        },
      },
    },
  },

  '/events/{eventId}': {
    get: {
      tags: ['Events'],
      summary: 'Get event by ID',
      parameters: [
        {
          name: 'eventId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Event details',
          content: {
            'application/json': {
              example: {
                status: 'Success',
                data: {
                  event: {
                    /* event object */
                  },
                },
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ['Events'],
      summary: 'Update event',
      parameters: [
        {
          name: 'eventId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            example: {
              title: 'Updated Event Title',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Event updated',
          content: {
            'application/json': {
              example: {
                status: 'Success',
                message: 'Event updated successfully!',
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Events'],
      summary: 'Delete event',
      parameters: [
        {
          name: 'eventId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Event deleted',
          content: {
            'application/json': {
              example: {
                status: 'Success',
                message: 'Event deleted successfully',
              },
            },
          },
        },
      },
    },
  },
};
