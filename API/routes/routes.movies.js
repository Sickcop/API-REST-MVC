import { randomUUID } from 'node:crypto'
import { Router } from "express";

import readJSON from '../utils.js'

import { validateMovie, validatePartialMovie } from '../schemes/movieSchema.js'

const movies = readJSON('./movies.json')
const router = Router()

router.get('/', (req, res)=>{
  res.header('Access-Control-Allow-Origin', '*')

  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if(movie) return res.json(movie)

  res.status(404).json({message: 'Movie not found'})
})

router.post('/', (req, res) => {
  
  const result = validateMovie(req.body)

  if(result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

router.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  
  if(!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.json(404).json({ messa: 'Movie not found' })

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie
  
  return res.json(updatedMovie)
})

router.delete('/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.json(404).json({ messa: 'Movie not found' })

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })

})

export default router