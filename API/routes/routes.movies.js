import { Router } from "express";

import { validateMovie, validatePartialMovie } from '../schemes/movieSchema.js'
import { MovieModel } from "../models/model.movie.js";


const router = Router()

router.get('/', (req, res)=>{
  res.header('Access-Control-Allow-Origin', '*')

  const { genre } = req.query
  const movies = MovieModel.getAll({ genre })
  res.json(movies)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const movie = await  MovieModel.getById({ id })
  if(movie) return res.json(movie)
  res.status(404).json({message: 'Movie not found'})
})

router.post('/', async (req, res) => {
  
  const result = validateMovie(req.body)

  if(result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = await MovieModel.create({input: result.data})

  res.status(201).json(newMovie)
})

router.patch('/:id', async (req, res) => {
  const result = validatePartialMovie(req.body)
  
  if(!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  
  const { id } = req.params

  const updatedMovie = await MovieModel.update({ is, input: result.data })

  return res.json(updatedMovie)
})

router.delete('/:id', async (req, res) => {

  //res.header('Access-Control-Allow-Origin', '*')
  const { id } = req.params

  const result = await MovieModel.delete({ id })

  if (result === false) return res.json(404).json({ messa: 'Movie not found' })
    return res.json({ message: 'Movie deleted' })

})

export default router