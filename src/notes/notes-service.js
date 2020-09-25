const NotesService = {
    getAllItems(knex) {
        return knex.select('*').from('noteful_inventory')
    },
    getAllPurchases(knex) {
        return knex.select('*').from('noteful_purchases')
    },
    getAllProfiles(knex) {
        return knex.select('*').from('noteful_profiles')
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
    insertProfile(knex, newProfile) {
        return knex
            .insert(newProfile)
            .into('noteful_profiles')
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
    deleteProfile(knex, id) {
        return knex('noteful_profiles')
            .where({ id })
            .delete()
    },
    updateInventory(knex, id, newNoteFields) {
        return knex('noteful_inventory')
            .where({ id })
            .update(newNoteFields)
    },
    updatePurchases(knex, id, newNoteFields) {
        return knex('noteful_purchases')
            .where({ id })
            .update(newNoteFields)
    },
    updateProfile(knex, id, newNoteFields) {
        return knex('noteful_profiles')
            .where({ id })
            .update(newNoteFields)
    }
}

module.exports = NotesService