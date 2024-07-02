// import { Request, Response } from 'express'
// import ReserveService from '../services/reserve.service'
// import { container } from 'tsyringe'

// class ReserveController {
//   async createReserve(req: Request, res: Response) {
//     try {
//       const { movie_id, session_id } = req.params
//       const { chair, value } = req.body

//       const reserveData = {
//         movie_id: parseInt(movie_id),
//         session_id: parseInt(session_id),
//         chair,
//         value: parseInt(value),
//       }
//       const service = container.resolve(ReserveService)
//       const reserves = await service.createReserve(reserveData)
//       return res.status(200).json(reserves)
//     } catch (error: any) {
//       if (error && error.status) {
//         return res
//           .status(error.status)
//           .json({ code: error.status, message: error.message })
//       } else {
//         console.error('Error handling creation of reserve:', error)
//         return res
//           .status(500)
//           .json({ code: 500, error: error.message.toString() })
//       }
//     }
//   }

//   async updateReserve(req: Request, res: Response): Promise<Response> {
//     const { id, session_id } = req.params
//     const { chair, value } = req.body

//     try {
//       const service = container.resolve(ReserveService)
//       const updatedReserve = await service.updateReserve({
//         id: parseInt(id),
//         session_id: parseInt(session_id),
//         chair,
//         value,
//       })
//       return res.status(200).json(updatedReserve)
//     } catch (error: any) {
//       if (error && error.status) {
//         return res
//           .status(error.status)
//           .json({ code: error.status, message: error.message })
//       } else {
//         console.error('Error handling update of reserve:', error)
//         return res
//           .status(500)
//           .json({ code: 500, error: error.message.toString() })
//       }
//     }
//   }

//   async deleteReserve(req: Request, res: Response) {
//     try {
//       const { session_id, id } = req.params

//       const reserveData = {
//         id: parseInt(id),
//         session_id: parseInt(session_id),
//       }
//       const service = container.resolve(ReserveService)
//       await service.deleteReserve(reserveData)
//       return res.status(204).json()
//     } catch (error: any) {
//       if (error && error.status) {
//         return res
//           .status(error.status)
//           .json({ code: error.status, message: error.message })
//       } else {
//         console.error('Error handling deletion of reserve:', error)
//         return res
//           .status(500)
//           .json({ code: 500, error: error.message.toString() })
//       }
//     }
//   }
// }

// export default ReserveController
