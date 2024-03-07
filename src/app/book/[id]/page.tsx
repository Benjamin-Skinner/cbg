import Client from './Client'
import { getBookById } from '@/functions/getBookById'
import { useRouter } from 'next/router'

interface Props {
	params: {
		id: string
	}
}

const Main: React.FC<Props> = async ({ params: { id } }) => {
	const book = await getBookById(id)
	return <Client bookData={book} />
}

export default Main
