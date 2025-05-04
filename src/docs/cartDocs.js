module.exports = {
  '/add/{eventId}': {
    post: {
      tags: ['Cart'],
      summary: 'Add event to user cart',
      description: 'Allows a logged-in user to add an event to their cart.',
      parameters: [
        {
          name: 'eventId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'ID of the event to add to the cart',
        },
      ],
      responses: {
        200: {
          description: 'Event added to cart or already exists',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Event is already in the cart',
                data: {
                  cart: {
                    _id: '60d...',
                    user: '60a...',
                    events: ['60e...', '60f...'],
                  },
                },
              },
            },
          },
        },
      },
    },
    },
    "/remove/:eventId": {
        delete: {
            tags: ['Cart'],
            summary: 'Remove event from user cart',
            description: "Removes an event from the user's cart if it exists.",
            parameters: [
              {
                name: 'eventId',
                in: 'path',
                required: true,
                schema: {
                  type: 'string',
                },
                description: 'ID of the event to remove from the cart',
              },
            ],
            responses: {
              200: {
                description: 'Event removed successfully',
                content: {
                  'application/json': {
                    example: {
                      status: 'success',
                      data: {
                        updatedCart: {
                          _id: '60d...',
                          user: '60a...',
                          events: ['60f...'],
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Event isn't in cart",
                content: {
                  'application/json': {
                    example: {
                      status: 'fail',
                      message: 'Event isnt in cart',
                    },
                  },
                },
              },
              404: {
                description: 'User has no cart',
                content: {
                  'application/json': {
                    example: {
                      status: 'fail',
                      message: "You don't have a cart",
                    },
                  },
                },
              },
            },
          },
    }
};
