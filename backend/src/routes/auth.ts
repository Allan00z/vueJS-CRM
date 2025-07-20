import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../generated/prisma'

const router = express.Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' })
  }

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({ message: 'Email déjà utilisé.' })
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création de l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
      }
    })

    return res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser })
  } catch (error) {
    console.error('Erreur lors de la création :', error)
    return res.status(500).json({ message: 'Erreur serveur.', error })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' })
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    
    if (!passwordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return res.status(500).json({ message: 'Erreur serveur.' })
  }
})

export default router
