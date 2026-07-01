// src/firebase.ts (Mocked)

// --- Mock Auth ---
export interface User {
  uid: string;
  email: string;
}

export const auth = { currentUser: null as User | null };

export const onAuthStateChanged = (authObj: any, callback: (user: User | null) => void) => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
  const savedUser = sessionStorage.getItem('mockUser');
  if (savedUser) {
    authObj.currentUser = JSON.parse(savedUser);
  } else {
    authObj.currentUser = { uid: 'admin-123', email: adminEmail };
    sessionStorage.setItem('mockUser', JSON.stringify(authObj.currentUser));
  }
  
  callback(authObj.currentUser);
  return () => {}; // unsubscribe function
};

export const signOut = async (authObj: any) => {
  authObj.currentUser = null;
  sessionStorage.removeItem('mockUser');
};

export const signInWithEmailAndPassword = async (authObj: any, email: string, _password: string) => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
  if (email === adminEmail) {
    authObj.currentUser = { uid: 'admin-123', email: adminEmail };
    sessionStorage.setItem('mockUser', JSON.stringify(authObj.currentUser));
    return { user: authObj.currentUser };
  } else {
    throw new Error('Invalid credentials');
  }
};

// --- Mock Firestore ---
export const db = {}; 

const getStore = () => {
  const data = localStorage.getItem('mockFirestore_v3');
  if (data) return JSON.parse(data);
  return { products: {}, reviews: {}, orders: {} };
};

const saveStore = (store: any) => {
  localStorage.setItem('mockFirestore_v3', JSON.stringify(store));
};

if (!localStorage.getItem('mockFirestore_v3')) {
  saveStore({
    products: {
      'p1': {
        name: 'Rolex Submariner Date',
        price: 2500000,
        description: 'The archetype of the diver’s watch. Features a unidirectional rotatable bezel and solid-link Oyster bracelet.',
        brand: 'Rolex',
        gender: 'Male',
        stock: 5,
        imageUrls: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 }
      },
      'p2': {
        name: 'Omega Speedmaster Professional',
        price: 1800000,
        description: 'The legendary Moonwatch. A chronograph that has been a part of all six lunar missions.',
        brand: 'Omega',
        gender: 'Male',
        stock: 3,
        imageUrls: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 5000 }
      },
      'p3': {
        name: 'Daniel Wellington Classic',
        price: 45000,
        description: 'Minimalist and elegant leather strap watch suitable for every occasion.',
        brand: 'Daniel Wellington',
        gender: 'Female',
        stock: 15,
        imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 10000 }
      },
      'p4': {
        name: 'Apple Watch Ultra',
        price: 220000,
        description: 'The most rugged and capable Apple Watch ever. Titanium case and precision dual-frequency GPS.',
        brand: 'Apple',
        gender: 'Unisex',
        stock: 8,
        imageUrls: ['https://images.unsplash.com/photo-1434493789847-2f02b0c48289?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 20000 }
      },
      'p5': {
        name: 'Tag Heuer Carrera',
        price: 950000,
        description: 'Classic sports watch with a sleek steel finish and high-precision chronograph.',
        brand: 'Tag Heuer',
        gender: 'Male',
        stock: 4,
        imageUrls: ['https://images.unsplash.com/photo-1587836374828-cb4387df3c7c?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 25000 }
      },
      'p6': {
        name: 'Casio Vintage Digital',
        price: 15000,
        description: 'Retro gold-tone digital watch with alarm, stopwatch, and auto-calendar.',
        brand: 'Casio',
        gender: 'Unisex',
        stock: 25,
        imageUrls: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 30000 }
      },
      'p7': {
        name: 'Seiko Presage Cocktail Time',
        price: 135000,
        description: 'A masterpiece of Japanese craftsmanship featuring a mesmerizing blue sunray dial.',
        brand: 'Seiko',
        gender: 'Male',
        stock: 6,
        imageUrls: ['https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 35000 }
      },
      'p8': {
        name: 'Garmin Fenix 7 Sapphire',
        price: 250000,
        description: 'Premium multisport GPS watch with solar charging and advanced performance metrics.',
        brand: 'Garmin',
        gender: 'Unisex',
        stock: 9,
        imageUrls: ['https://images.unsplash.com/photo-1509741102003-ca59ec6a15ea?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 40000 }
      },
      'p9': {
        name: 'Tissot PRX Powermatic 80',
        price: 180000,
        description: 'A throwback to 1970s design with an integrated bracelet and 80-hour power reserve.',
        brand: 'Tissot',
        gender: 'Male',
        stock: 12,
        imageUrls: ['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 45000 }
      },
      'p10': {
        name: 'Fossil Gen 6 Smartwatch',
        price: 65000,
        description: 'A stylish smartwatch combining classic design with modern Wear OS features.',
        brand: 'Fossil',
        gender: 'Female',
        stock: 10,
        imageUrls: ['https://images.unsplash.com/photo-1508656934052-cd38221d6ebc?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 50000 }
      },
      'p11': {
        name: 'Citizen Eco-Drive Promaster',
        price: 110000,
        description: 'Professional diver’s watch powered by light, never needing a battery change.',
        brand: 'Citizen',
        gender: 'Male',
        stock: 7,
        imageUrls: ['https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 55000 }
      },
      'p12': {
        name: 'Cartier Tank Must',
        price: 900000,
        description: 'The epitome of elegance. Rectangular steel case with Roman numerals.',
        brand: 'Cartier',
        gender: 'Female',
        stock: 2,
        imageUrls: ['https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 60000 }
      },
      'p13': {
        name: 'Breitling Navitimer',
        price: 2100000,
        description: 'The iconic pilot’s chronograph featuring a circular slide rule bezel.',
        brand: 'Breitling',
        gender: 'Male',
        stock: 3,
        imageUrls: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 65000 }
      },
      'p14': {
        name: 'G-Shock Mudmaster',
        price: 85000,
        description: 'Built to withstand the toughest environments. Mud, shock, and water resistant.',
        brand: 'Casio',
        gender: 'Male',
        stock: 11,
        imageUrls: ['https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&q=80&w=800'],
        createdAt: { seconds: Date.now() / 1000 - 70000 }
      }
    },
    reviews: {},
    orders: {}
  });
}

export interface CollectionReference { path: string; }
export interface DocumentReference { path: string; id: string; }

export const collection = (_dbObj: any, path: string): CollectionReference => ({ path });

export const doc = (dbObjOrColl: any, ...pathSegments: string[]): DocumentReference => {
  if (typeof dbObjOrColl === 'object' && dbObjOrColl.path) {
    const id = pathSegments[0] || Math.random().toString(36).substring(2, 15);
    return { path: dbObjOrColl.path, id };
  } else {
    const path = pathSegments[0];
    const id = pathSegments[1] || Math.random().toString(36).substring(2, 15);
    return { path, id };
  }
};

export const query = (coll: CollectionReference, ...constraints: any[]) => {
  return { path: coll.path, constraints };
};
export const where = (field: string, op: string, value: any) => ({ type: 'where', field, op, value });
export const orderBy = (field: string, direction: string = 'asc') => ({ type: 'orderBy', field, direction });
export const limit = (n: number) => ({ type: 'limit', n });

export const getDocs = async (queryOrColl: any) => {
  const store = getStore();
  const path = queryOrColl.path;
  const collectionData = store[path] || {};
  
  let results = Object.keys(collectionData).map(id => ({
    id,
    data: () => collectionData[id],
    exists: () => true
  }));

  if (queryOrColl.constraints) {
    for (const c of queryOrColl.constraints) {
      if (c.type === 'where') {
        results = results.filter(doc => {
          const val = doc.data()[c.field];
          if (c.op === '==') return val === c.value;
          if (c.op === 'array-contains') return Array.isArray(val) && val.includes(c.value);
          return true;
        });
      }
      if (c.type === 'orderBy') {
        results.sort((a, b) => {
          const valA = a.data()[c.field];
          const valB = b.data()[c.field];
          const numA = valA?.seconds || valA;
          const numB = valB?.seconds || valB;
          if (c.direction === 'desc') return numA > numB ? -1 : 1;
          return numA > numB ? 1 : -1;
        });
      }
      if (c.type === 'limit') {
        results = results.slice(0, c.n);
      }
    }
  }

  return {
    docs: results,
    empty: results.length === 0,
    forEach: (cb: any) => results.forEach(cb)
  };
};

export const getDoc = async (docRef: DocumentReference) => {
  const store = getStore();
  const data = store[docRef.path]?.[docRef.id];
  return {
    id: docRef.id,
    data: () => data,
    exists: () => !!data
  };
};

export const addDoc = async (collRef: CollectionReference, data: any) => {
  const store = getStore();
  if (!store[collRef.path]) store[collRef.path] = {};
  const id = Math.random().toString(36).substring(2, 15);
  store[collRef.path][id] = data;
  saveStore(store);
  return { id, path: collRef.path };
};

export const setDoc = async (docRef: DocumentReference, data: any) => {
  const store = getStore();
  if (!store[docRef.path]) store[docRef.path] = {};
  store[docRef.path][docRef.id] = data;
  saveStore(store);
};

export const updateDoc = async (docRef: DocumentReference, data: any) => {
  const store = getStore();
  if (store[docRef.path]?.[docRef.id]) {
    store[docRef.path][docRef.id] = { ...store[docRef.path][docRef.id], ...data };
    saveStore(store);
  }
};

export const deleteDoc = async (docRef: DocumentReference) => {
  const store = getStore();
  if (store[docRef.path]?.[docRef.id]) {
    delete store[docRef.path][docRef.id];
    saveStore(store);
  }
};

export const serverTimestamp = () => {
  return { seconds: Math.floor(Date.now() / 1000) };
};

export const writeBatch = (_dbObj: any) => {
  const ops: any[] = [];
  return {
    set: (docRef: DocumentReference, data: any) => { ops.push({ type: 'set', docRef, data }); },
    update: (docRef: DocumentReference, data: any) => { ops.push({ type: 'update', docRef, data }); },
    delete: (docRef: DocumentReference) => { ops.push({ type: 'delete', docRef }); },
    commit: async () => {
      const store = getStore();
      ops.forEach(op => {
        const { docRef, data, type } = op;
        if (!store[docRef.path]) store[docRef.path] = {};
        if (type === 'set') store[docRef.path][docRef.id] = data;
        if (type === 'update') store[docRef.path][docRef.id] = { ...store[docRef.path][docRef.id], ...data };
        if (type === 'delete') delete store[docRef.path][docRef.id];
      });
      saveStore(store);
    }
  };
};
