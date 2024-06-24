const contacts: Contact[] = [];
let nextId = 1;

export class ContactDB {
    async getContacts(): Promise<Contact[]> {
        return contacts;
    }

    async getContact(id: number): Promise<Contact | undefined> {
        return contacts.find(c => c.id === id);
    }

    async addContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
        const newContact = { ...contact, id: nextId++ };
        contacts.push(newContact);

        return newContact;
    }

    async updateContact(id: number, updatedContact: Omit<Contact, 'id'>): Promise<string | undefined> {
        const contactIndex = contacts.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
            contacts[contactIndex] = { ...updatedContact, id };

            return "success";
        } else {
            return undefined;
        }
    }

    async removeContact(id: number): Promise<string | undefined> {
        const contactIndex = contacts.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
            contacts.splice(contactIndex, 1);

            return "success";
        } else {
            return undefined;
        }
    }
}