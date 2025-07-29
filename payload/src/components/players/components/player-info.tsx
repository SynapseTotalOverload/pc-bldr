import { PlayerWithRelations } from '@/blocks/ApiPlayerList/types'

export const PlayerInfo = ({ player }: { player: PlayerWithRelations }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <div className="flex-shrink-0">
        <img
          src={player.player_img}
          alt={player.player_name}
          className="rounded-full w-40 h-40 object-cover"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{player.player_name}</h1>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-24 font-medium text-gray-600">Team:</td>
              <td className="text-gray-900">{player.team}</td>
            </tr>
            <tr>
              <td className="w-24 font-medium text-gray-600">Country:</td>
              <td className="text-gray-900">{player.country}</td>
            </tr>
            <tr>
              <td className="w-24 font-medium text-gray-600">Name:</td>
              <td className="text-gray-900">{player.name}</td>
            </tr>
            <tr>
              <td className="w-24 font-medium text-gray-600">Birthday:</td>
              <td className="text-gray-900">{player.birthday}</td>
            </tr>
          </tbody>
        </table>
        <div className="description">
          <p>
            {player.info}
          </p>
        </div>
      </div>
      {/* <div className="flex-2">
        <ul className="flex flex-col gap-2">
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </li>
        </ul>
      </div> */}
    </div>
  )
}