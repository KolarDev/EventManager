// docs/authDocs.js

module.exports = {
  '/users/signup': {
    post: {
      tags: ['Users'],
      summary: 'User sign up',
      description: 'Registers a new user and sends a welcome email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'fullname',
                'phone',
                'email',
                'password',
                'passwordConfirm',
              ],
              properties: {
                fullname: { type: 'string', example: 'Jane Doe' },
                phone: { type: 'string', example: '+1234567890' },
                email: { type: 'string', example: 'jane@example.com' },
                password: { type: 'string', example: 'pass1234' },
                passwordConfirm: { type: 'string', example: 'pass1234' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully and logged in',
          content: {
            'application/json': {
              example: {
                status: 'success',
                token: 'jwt.token.here',
                data: {
                  user: {
                    _id: '60c72b2f9b1e8b2d88e1c123',
                    fullname: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '+1234567890',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/users/login': {
    post: {
      tags: ['Users'],
      summary: 'User login',
      description:
        'Logs in a registered user by verifying credentials and returns a JWT.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', example: 'jane@example.com' },
                password: { type: 'string', example: 'pass1234' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              example: {
                status: 'success',
                token: 'jwt.token.here',
                data: {
                  user: {
                    _id: '60c72b2f9b1e8b2d88e1c123',
                    fullname: 'Jane Doe',
                    email: 'jane@example.com',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Invalid Credentials!!',
              },
            },
          },
        },
      },
    },
  },

  '/users/me': {
    get: {
      tags: ['Users'],
      summary: 'Get logged-in user profile',
      description:
        'Returns the profile information of the currently authenticated user.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User profile retrieved',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: {
                  user: {
                    _id: '60c72b2f9b1e8b2d88e1c123',
                    fullname: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '+1234567890',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'User not found',
              },
            },
          },
        },
      },
    },
  },

  '/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      description: 'Returns a list of all users (Admin access only).',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of users',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: {
                  users: [
                    {
                      _id: '60c72b2f9b1e8b2d88e1c123',
                      fullname: 'Jane Doe',
                      email: 'jane@example.com',
                      phone: '+1234567890',
                    },
                  ],
                },
              },
            },
          },
        },
        404: {
          description: 'No users found',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Users not found',
              },
            },
          },
        },
      },
    },
  },

  '/users/send-otp': {
    post: {
      tags: ['Auth'],
      summary: 'Send OTP to user email or phone',
      description: 'Sends an OTP to the logged-in user for verification.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OTP sent successfully',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'OTP sent to your email/phone',
              },
            },
          },
        },
        404: {
          description: 'User not found',
        },
      },
    },
  },

  '/users/verify-otp': {
    post: {
      tags: ['Auth'],
      summary: 'Verify user account using OTP',
      description: 'Verifies user account via OTP sent to email or phone.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                otp: { type: 'string' },
              },
              required: ['otp'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Verification successful',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Account Verification Successful !',
              },
            },
          },
        },
        400: {
          description: 'Invalid OTP',
        },
      },
    },
  },

  '/users/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Send reset password link to user email',
      description: 'Generates a reset token and sends it to the user email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'user@example.com' },
              },
              required: ['email'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Reset link sent',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Reset Password link sent to your email',
              },
            },
          },
        },
        404: {
          description: 'No user with this email',
        },
      },
    },
  },

  '/users/{token}/reset-password': {
    patch: {
      tags: ['Auth'],
      summary: 'Reset password using token',
      description: 'Allows a user to reset password using the reset token.',
      parameters: [
        {
          name: 'token',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                password: { type: 'string' },
                passwordConfirm: { type: 'string' },
              },
              required: ['password', 'passwordConfirm'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset successful',
          content: {
            'application/json': {
              example: {
                status: 'success',
                token: 'jwt-token',
                data: {
                  user: {
                    _id: 'userId',
                    name: 'John Doe',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid or expired token',
        },
      },
    },
  },

  '/users/update-password': {
    patch: {
      tags: ['Auth'],
      summary: 'Update password (Logged-in users)',
      description: 'Allows logged-in users to update their password.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                passwordCurrent: { type: 'string' },
                password: { type: 'string' },
              },
              required: ['passwordCurrent', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password updated successfully',
          content: {
            'application/json': {
              example: {
                status: 'success',
                token: 'jwt-token',
                data: {
                  user: {
                    _id: 'userId',
                    name: 'John Doe',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Incorrect current password',
        },
      },
    },
  },
};
