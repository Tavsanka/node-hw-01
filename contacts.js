const fs = require("node:fs").promises;
const { connect } = require("node:http2");
const path = require("node:path");

const contactsPath = "./db/contacts.json";

function listContacts() {
  const file = fs.readFile(path.resolve(contactsPath), "utf-8");
  file.then((content) => {
    console.table(JSON.parse(content));
  });
}

function getContactById(contactId) {
  const file = fs.readFile(path.resolve(contactsPath), "utf-8");
  file.then((content) => {
    const result = JSON.parse(content);
    console.log(result.find((contact) => contact.id == contactId));
  });
}

async function removeContact(contactId) {
  try {
    const content = await fs.readFile(path.resolve(contactsPath), "utf-8");
    const result = JSON.parse(content);
    const afterDelete = result.filter((contact) => contact.id !== contactId);
    await fs.writeFile(
      path.resolve(contactsPath),
      JSON.stringify(afterDelete, null, 2)
    );
    console.log("Zapis do pliku zakończony powodzeniem.".green);
  } catch (err) {
    console.error("Error removing contact:", err);
  }
}

async function addContact(name, email, phone) {
  try {
    const { nanoid } = await import("nanoid");
    const content = await fs.readFile(path.resolve(contactsPath), "utf-8");
    const contacts = JSON.parse(content);

    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);

    await fs.writeFile(
      path.resolve(contactsPath),
      JSON.stringify(contacts, null, 2)
    );
    console.log("Kontakt został pomyślnie dodany.".green);
  } catch (err) {
    console.error("Error adding contact:", err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
