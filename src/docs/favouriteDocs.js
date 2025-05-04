module.exports = {
    '/favorites/add/{eventId}': {
    post: {
    tags: ['Favorites'],
    summary: 'Add event to favorites',
    description: 'Adds a specific event to the authenticated user\'s favorites list.',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'eventId',
        in: 'path',
        required: true,
        description: 'The ID of the event to add to favorites.',
        schema: {
          type: 'string'
        }
      }
    ],
    responses: {
      200: {
        description: 'Event successfully added to favorites or already exists',
        content: {
          'application/json': {
            examples: {
              added: {
                value: {
                  status: 'success',
                  data: {
                    favorites: [{ /* event objects */ }]
                  }
                }
              },
              duplicate: {
                value: {
                  status: 'success',
                  message: 'Event is already saved to favorites'
                }
              }
            }
          }
        }
      }
    }
  },
 
    },
    "/events/remove/{eventId}": {
        delete: {
            tags: ['Favorites'],
            summary: 'Remove event from favorites',
            description: 'Removes a specific event from the authenticated user\'s favorites list.',
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'eventId',
                in: 'path',
                required: true,
                description: 'The ID of the event to remove from favorites.',
                schema: {
                  type: 'string'
                }
              }
            ],
            responses: {
              200: {
                description: 'Event successfully removed from favorites',
                content: {
                  'application/json': {
                    example: {
                      status: 'success',
                      data: {
                        updatedFavorites: [{ /* updated event objects */ }]
                      }
                    }
                  }
                }
              },
              401: {
                description: 'Event isn\'t in favorites'
              },
              404: {
                description: 'User doesn\'t have a favorites document'
              }
            }
          }
    }

}