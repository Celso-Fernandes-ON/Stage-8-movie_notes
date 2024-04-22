const knex = require("../database/knex")

class MoviesController {
  async create(req,res) {
    const { title, description, rating, tags } = req.body
    const { user_id } = req.params

    const [movies_id] = await knex("movies").insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        movies_id,
        name,
        user_id
      }
    })

    await knex("tags").insert(tagsInsert)

    res.json()
  }

  async show(req,res) {
    const { id } = req.params

    const movie = await knex("movies").where({ id }).first()
    const tags = await knex("tags").where({ movies_id: id }).orderBy("name")

    return res.json({
      ...movie,
      tags,
    })
  }

  async delete(req,res){
    const { id } = req.params

    await knex("movies").where({ id }).delete()

    return res.json()
  }
  async index(req,res){
    const {title ,user_id, tags} = req.query

    let movies

    if(tags){
      const filterTags = tags.split(',').map(tag => tag.trim())
      movies = await knex('tags')
      .select([
        "movies.id",
        "movies.title",
        "movies.user_id",

      ])
      .where("movies.user_id",user_id)
      .whereLike("movies.title",`%${title}%`)
      .whereIn("name",filterTags)
      .innerJoin("movies","movies.id","tags.movies_id")
      .orderBy("movies.title")

    }else{
      notes = await knex('movies')
      .where({user_id})
      .whereLike("title",`%${title}%`)
      .orderBy('title')

    }
    const userTags = await knex("tags").where({user_id})
    const moviesWithTags = movies.map(note =>{
      const moviesTags = userTags.filter(tag => tag.movies_id === movies.id)
      return{
        ...movies,
        tags: moviesTags
      }
    })

    return res.json(moviesWithTags)
  }
}

module.exports = MoviesController