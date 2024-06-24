import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger'
import { ContactDB } from './db';

const contactApi = new Elysia({ prefix: '/api' })
    .get('/contacts',
        async ({ db }: { db: ContactDB }) => {
            const contacts = await db.getContacts();
            return {
                success: true,
                data: contacts
            };
        },
        {
            detail: {
                summary: 'Get contacts',
                description: 'Get all contacts from the database',
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean'
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Contact'
                                            },
                                            example: [{
                                                id: 1,
                                                name: 'Wahyu',
                                                email: 'wahyu@example.com'
                                            }]
                                        }
                                    },
                                    required: ['success', 'data']
                                }
                            }
                        }
                    }
                }
            }
        }
    )
    .get('/contacts/:id',
        async ({ db, params }: { db: ContactDB, params: { id: string } }) => {
            const id = parseInt(params.id);
            if (id === undefined) {
                return { success: false, message: 'Invalid request' };
            }

            const contact = await db.getContact(id);
            if (contact === undefined) {
                return { success: false, message: 'Not found' };
            }

            return { success: true, data: contact };
        },
        {
            detail: {
                summary: 'Get contact by ID',
                description: 'Get contact from the database by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'Contact ID',
                        required: true,
                        schema: {
                            type: 'number'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean'
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: {
                                                    type: 'number'
                                                },
                                                name: {
                                                    type: 'string'
                                                },
                                                email: {
                                                    type: 'string'
                                                }
                                            },
                                            example: {
                                                id: 1,
                                                name: 'Wahyu',
                                                email: 'wahyu@example.com'
                                            },
                                            required: ['id', 'name', 'email']
                                        }
                                    },
                                    required: ['success', 'data']
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Not Found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: false
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Contact not found'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    }
                }
            }
        }
    )
    .post(
        "/contacts",
        async ({ db, body }: { db: ContactDB, body: Contact }) => {
            const id = (await db.addContact(body)).id

            return { success: true, message: `Contact ${id} added` };
        },
        {
            detail: {
                summary: 'Add contact',
                description: 'Add contact to the database',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' }
                                },
                                example: {
                                    name: 'Wahyu',
                                    email: 'wahyu@example.com'
                                },
                                required: ['name', 'email']
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Contact 1 added'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Bad Request',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: false
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Invalid request'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    }
                }
            }
        }
    )
    .put(
        "/contacts/:id",
        async ({ db, params, body }: { db: ContactDB, params: { id: string }, body: Contact }) => {
            const id = parseInt(params.id);
            if (id === undefined) {
                return { success: false, message: 'Invalid request' };
            }

            const contact = await db.updateContact(id, body);
            if (contact === undefined) {
                return { success: false, message: 'Not found' };
            }

            return { success: true, message: `Contact ${id} updated` };
        },
        {
            detail: {
                summary: 'Update contact',
                description: 'Update contact in the database',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'Contact ID',
                        required: true,
                        schema: {
                            type: 'number'
                        }
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' }
                                },
                                example: {
                                    name: 'Wahyu Ivan',
                                    email: 'wahyu@example.com'
                                },
                                required: ['name', 'email']
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Contact 1 updated'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Bad Request',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: false
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Invalid request'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Not Found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: false
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Contact not found'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    }
                }
            }
        }
    ).delete(
        "/contacts/:id",
        async ({ db, params }: { db: ContactDB, params: { id: string } }) => {
            const id = parseInt(params.id);
            if (id === undefined) {
                return { success: false, message: 'Invalid request' };
            }

            const contact = await db.removeContact(id);
            if (contact === undefined) {
                return { success: false, message: 'Not found' };
            }

            return { success: true, message: `Contact ${id} removed` };
        },
        {
            detail: {
                summary: 'Remove contact',
                description: 'Remove contact from the database',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'Contact ID',
                        required: true,
                        schema: {
                            type: 'number'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Contact 1 removed'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Not Found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: false
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Contact not found'
                                        }
                                    },
                                    required: ['success', 'message']
                                }
                            }
                        }
                    }
                }
            }
        }
    );

new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'Contact API',
                version: '1.0.0',
                description: 'Contact API project. Developed using Elysia framework, bun, and TypeScript.'
            }
        }
    }))
    .use(contactApi)
    .decorate('db', new ContactDB())
    .listen(3000);

