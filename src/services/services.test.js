import { beforeEach, describe, expect, test, vi } from 'vitest'
import { addTurno } from './turnoService'
import { addProductSale, getAllProductSales } from './ventaService'

// Simple in-memory store to mock Firestore
const store = {}

vi.mock('./firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-uid' } }
}))

vi.mock('firebase/firestore', () => ({
  collection: (...path) => path.join('/'),
  addDoc: async (colPath, data) => {
    const id = Math.random().toString(36).slice(2)
    if (!store[colPath]) store[colPath] = []
    store[colPath].push({ id, ...data })
    return { id }
  },
  onSnapshot: () => () => {},
  doc: (...path) => ({ colPath: path.slice(0, -1).join('/'), id: path.at(-1) }),
  getDoc: async (ref) => {
    const docs = store[ref.colPath] || []
    const d = docs.find((x) => x.id === ref.id)
    return { exists: () => !!d, id: ref.id, data: () => d }
  },
  updateDoc: async () => {},
  deleteDoc: async () => {},
  query: (colPath, ...filters) => ({ colPath, filters }),
  where: (field, _op, value) => ({ field, value }),
  getDocs: async (colOrQuery) => {
    const colPath = typeof colOrQuery === 'string' ? colOrQuery : colOrQuery.colPath
    const filters = typeof colOrQuery === 'string' ? [] : colOrQuery.filters
    let docs = store[colPath] || []
    if (filters.length) {
      docs = docs.filter((doc) => filters.every((f) => doc[f.field] === f.value))
    }
    return { docs: docs.map((doc) => ({ id: doc.id, data: () => doc })) }
  },
}))

beforeEach(() => {
  for (const key in store) delete store[key]
})

describe('addTurno', () => {
  test('rechaza horarios duplicados', async () => {
    await addTurno({ fecha: '2025-01-01', hora: '10:00' })
    await expect(
      addTurno({ fecha: '2025-01-01', hora: '10:00' })
    ).rejects.toThrow()
  })
})

describe('addProductSale', () => {
  test('guarda datos válidos', async () => {
    const sale = {
      nombre: 'Gel',
      costo: 5,
      precioVenta: 10,
      fecha: '2025-01-01',
      categoria: 'cuidado',
    }
    const saved = await addProductSale(sale)
    expect(saved).toMatchObject(sale)
    const all = await getAllProductSales()
    expect(all).toContainEqual(saved)
  })
})
