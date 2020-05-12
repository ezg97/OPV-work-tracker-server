const NotesService = {
    getAllItems(knex) {
        return knex.select('*').from('noteful_inventory')
    },
    getAllPurchases(knex) {
        return knex.select('*').from('noteful_purchases')
    },
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('noteful_inventory')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    insertPurchase(knex, newPurchase) {
        return knex
            .insert(newPurchase)
            .into('noteful_purchases')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('noteful_notes').select('*').where('id', id).first()
    },
    deletePurchase(knex, id) {
        return knex('noteful_purchases')
            .where({ id })
            .delete()
    },
    deleteItem(knex, id) {
        return knex('noteful_inventory')
            .where({ id })
            .delete()
    },
    updateNote(knex, id, newNoteFields) {
        return knex('noteful_notes')
            .where({ id })
            .update(newNoteFields)
    }
}

module.exports = NotesService