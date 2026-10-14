import { openDB, IDBPDatabase, DBSchema } from 'idb';

interface StudyMateDB extends DBSchema {
  conversations: {
    key: string;
    value: {
      id: string;
      title: string;
      createdAt: number;
      messages: Array<{
        id: string;
        role: 'user' | 'assistant';
        content: string;
        timestamp: number;
      }>;
    };
    indexes: { 'by-createdAt': number };
  };
}

const DB_NAME = 'StudyMateDB';
const DB_VERSION = 1;

let db: IDBPDatabase<StudyMateDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<StudyMateDB>> {
  if (db) return db;

  db = await openDB<StudyMateDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const conversationsStore = db.createObjectStore('conversations', {
        keyPath: 'id',
      });
      conversationsStore.createIndex('by-createdAt', 'createdAt');
    },
  });

  return db;
}

export async function getAllConversations() {
  const db = await getDB();
  const all = await db.getAll('conversations');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getConversation(id: string) {
  const db = await getDB();
  return db.get('conversations', id);
}

export async function saveConversation(
  id: string,
  title: string,
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>
) {
  const db = await getDB();
  await db.put('conversations', {
    id,
    title,
    createdAt: Date.now(),
    messages,
  });
}

export async function updateConversationMessages(
  id: string,
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>
) {
  const db = await getDB();
  const conversation = await db.get('conversations', id);
  if (conversation) {
    conversation.messages = messages;
    await db.put('conversations', conversation);
  }
}

export async function deleteConversation(id: string) {
  const db = await getDB();
  await db.delete('conversations', id);
}
