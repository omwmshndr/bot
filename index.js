const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions} = require('./options')
const TOKEN = '6749602884:AAFo6NL7JD1gZ0ZsnpqvzEjlKiTSmH2xB5A'

const bot = new TelegramApi(TOKEN, { polling: true })

const chats = {}

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты угадай ее!')
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Старт' },
		{ command: '/info', description: 'Инфо' },
		{ command: '/game', description: 'Угадай цифру' }
	])


	bot.on('message', async message => {
		const text = message.text
		const chatId = message.chat.id

		if (text === '/start') {
			return bot.sendMessage(chatId, 'Дарова')
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Пусто`)
		}
		if (text === '/game') {
			return startGame(chatId)
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю')
	})

	bot.on('callback_query', async message => {
		const data = message.data
		const chatId = message.message.chat.id
		if (data === '/again') {
			return startGame(chatId)
		}

		data === chats[chatId] ?
			bot.sendMessage(chatId, `Ты угадал!`, againOptions) :
			bot.sendMessage(chatId, `Неа, я загадал ${chats[chatId]}`, againOptions)
	})
}

start()