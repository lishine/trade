import Dexie from 'dexie'

export const testDb = async (p) => {
    let db = new Dexie('friend_database')
    db.version(1).stores({
        friends: 'name',
    })
    console.log('1p', p.length)
    await db.friends.put({ name: p })
    console.log('finisihed put')
    let a = await db.friends.toArray()
    // console.log('p1', a)
    console.log('finshed reading', a[0].name.length)
}
