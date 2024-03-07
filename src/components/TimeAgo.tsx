'use client'

import TimeAgo from 'javascript-time-ago'
import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

interface Props {
	time: number
}

const TimeSince: React.FC<Props> = ({ time }) => {
	return <ReactTimeAgo date={time} locale="en-US" />
}

export default TimeSince
