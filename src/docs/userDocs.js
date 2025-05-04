// docs/authDocs.js

module.exports = {
  '/api/v1/users/send-otp': {
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

  '/api/v1/users/verify-otp': {
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

  '/api/v1/users/forgot-password': {
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

  '/api/v1/users/{token}/reset-password': {
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

  '/api/v1/users/update-password': {
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
