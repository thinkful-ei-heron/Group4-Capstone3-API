const JournalService ={



    insertJournal(knex, newJournal) {
        return knex 
            .insert(newJournal)
            .into('journal')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteJournal(knex, id) {
        return knex('journal')
        .where({ id })
        .delete()
    },

    
    
}

module.exports = JournalService