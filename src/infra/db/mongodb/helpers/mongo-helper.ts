import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect (url: string) {
    this.url = url
    this.client = await MongoClient.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect () {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url)
    }

    return this.client.db().collection(name)
  },

  mapId (inserted: any) {
    const {
      _id,
      ...insertedAccountData
    } = inserted

    return {
      ...insertedAccountData,
      id: _id.toString()
    }
  }
}
