import React, { useEffect, useState,useReducer } from 'react'
import { Badge, Button, Card, Col, List, Row, Typography } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { differenceInDays, format, formatDistanceToNow, parseISO } from 'date-fns'
import { kyCache } from '@/utilities/ky-cache'
import globalConfig from '@/stores/global'
import { useNotification } from "@/stores/notification-container"
import t from '@/language'
const { shopDomain } = globalConfig
const { Title } = Typography

/**
 * Notification Center
 * @constructor
 */

const initialState = {
	data: [],
	loading: false,
	initLoading: true,
	page: 1,
};

function reducer(state, action) {
	switch (action.type) {
	  case "mounted":
			return { ...state, initLoading: action.data.isNext, data: action.data.notis };
	  case "on load more":
			return { ...state, loading: true,};
		case 'fetch more done':
			return {initLoading: action.res.isNext, loading: false, data: state.data.concat(action.res.notis), page: state.page + 1 }
		case 'read':
			return {...state, data: action.newData}
	  default:
			return state;
	}
}
function Notification() {
	const [state, dispatch] = useReducer(reducer, initialState);
	console.log('state', state)
	// const [data, setData] = useState([])
	// const [loading, setLoading] = useState(false)
	// const [initLoading, setInitLoading] = useState(true)
	// const [page, setPage] = useState(1)
	const {data, loading, initLoading, page} = state
	const { updateNotification } = useNotification()
	useEffect(() => {
		kyCache(`/api/noti?shop=${shopDomain}&limit=3`).then((data: any) => {
			//const { notis, isNext } = data
			// setInitLoading(isNext)
			// setData(notis)
			dispatch({ type: "mounted", data })
		})
	}, [])

	const timeToPlainText = (time: string) => {
		const today = new Date()
		const then = parseISO(new Date(time).toISOString())
		const diffDays = differenceInDays(today, then)
		if (diffDays < 2) {
			return formatDistanceToNow(then)
		} else {
			return format(then, 'MMMM d, yyyy')
		}
	}

	const onLoadMore = () => {
		//setLoading(true)
		dispatch({ type: 'on load more'})
		kyCache(`/api/noti?shop=${shopDomain}&limit=3&page=${page + 1}`).then((res: any) => {
			//const { notis, isNext } = res
			// setInitLoading(isNext)
			// setLoading(false)
			// setData(data.concat(notis))
			// setPage(page + 1)
			dispatch({ type: 'fetch more done', res})
		})
		window.dispatchEvent(new Event('resize'))
	}
	const loadMore =
	//initLoading ? (
				<div
					style={{
						textAlign: 'center',
						marginTop: 12,
						height: 32,
						lineHeight: '32px'
					}}
				>
					<Button onClick={onLoadMore}>Loading more</Button>
				</div>
	//) : null

	return <Row>
		<Col span={24} xxl={{ span: 16, offset: 4 }} xl={{ span: 20, offset: 2 }}>
			<Row justify={'space-between'}>
				<Title level={3} className={'mgz h-x3'}>{t('NOTIFICATION')}</Title>
				<Button icon={<BellOutlined/>} type='link' onClick={() => {
					window.$crisp.push(['do', 'chat:open'])
				}}>Give Feedback</Button>
			</Row>
			<Card className={'notification detail'} bodyStyle={{padding: 0}} style={{ ['--mt' as any]: '24px' }}>
				<List
					itemLayout='horizontal'
					loading={loading}
					loadMore={loadMore}
				>
					{data.map((item: any, index: number) => {
						const { content, url } = item.data
						return <List.Item
							key={index}
							style={{ cursor: 'pointer' }}
							className={item.read ? 'read' : null}
							onClick={async () => {
								let newData = [...data]
								newData[index] = {
									...newData[index],
									read: true,
									checked: true
								}
								await updateNotification(item._id, {
									read: true,
									checked: true
								})
								//setData(newData)
								dispatch({type: 'read', newData})
								window.open(url)
							}}
						>
							<Badge status={item.read ? 'default' : 'processing'}/>
							<List.Item.Meta
								title={<span style={{ color: item.read ? 'var(--dark-color)' : undefined }}>{content}</span>}
								description={timeToPlainText(item.receivedTime || item._doc.receivedTime)}
							/>
						</List.Item>
					})}
				</List>
			</Card>
		</Col>
	</Row>
}

export default Notification
