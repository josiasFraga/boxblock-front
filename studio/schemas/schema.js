import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

export default createSchema({
  name: 'default',

  types: schemaTypes.concat([
    {
      name: 'users',
      title: 'Users',
      type: 'document',
      fields: [
        {
          name: 'userName',
          title: 'User Name',
          type: 'string',
        },
        {
          name: 'walletAddress',
          title: 'Wallet Address',
          type: 'string',
        },
        {
          name: 'profileImage',
          title: 'Profile Image',
          type: 'string',
        },
        {
          name: 'bannerImage',
          title: 'Banner Image',
          type: 'string',
        },
        {
          name: 'twitterHandle',
          title: 'Twitter',
          type: 'string',
        },
        {
          name: 'igHandle',
          title: 'Instagram',
          type: 'string',
        },
        {
          name: 'fbHandle',
          title: 'Facebook',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phoneHandle',
          title: 'Telefone',
          type: 'string',
        },
        {
          name: 'saldo',
          title: 'Saldo',
          type: 'number',
        },
        {
          name: 'saldoUsado',
          title: 'Saldo Usado',
          type: 'number',
        },
      ],
    },
    {
      name: 'marketItems',
      title: 'Coleções',
      type: 'document',
      fields: [
        {
          name: 'title',
          title: 'Título',
          type: 'string',
        },
        {
          name: 'tokenName',
          title: 'Nome dos Tokens',
          type: 'string',
        },
        {
          name: 'tag',
          title: 'Tag',
          type: 'string',
        },
        {
          name: 'symbol',
          title: 'Símbolo',
          type: 'string',
        },
        {
          name: 'contractAddress',
          title: 'Endereço do Contrato',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Descrição',
          type: 'string',
        },
        {
          name: 'createdBy',
          title: 'Criado Por',
          type: 'reference',
          to: [{ type: 'users' }],
        },
        {
          name: 'volumeTraded',
          title: 'Volume Negociado',
          type: 'number',
        },
        {
          name: 'floorPrice',
          title: 'Preço mais baixo',
          type: 'number',
        },
        {
          name: 'profileImage',
          title: 'Imagem de Perfil',
          type: 'string',
        },
        {
          name: 'bannerImage',
          title: 'Imagem do Banner',
          type: 'string',
        },
      ],
    },
    {
      name: 'marketTokens',
      title: 'Tokens',
      type: 'document',
      fields: [
        {
          name: 'contractAddress',
          title: 'Endereço do Contrato',
          type: 'string',
        },
        {
          name: 'url',
          title: 'Url',
          type: 'string',
        },
        {
          name: 'tokenId',
          title: 'ID do Token',
          type: 'number'
        },
        {
          name: 'createdBy',
          title: 'Criado Por',
          type: 'reference',
          to: [{ type: 'users' }],
        },
        {
          name: 'collection',
          title: 'Coleção',
          type: 'reference',
          to: [{ type: 'marketItems' }],
        },
        {
          name: 'owner',
          title: 'Holder',
          type: 'reference',
          to: [{ type: 'users' }],
        },
        {
          name: 'internalOwner',
          title: 'Dono Interno',
          type: 'reference',
          to: [{ type: 'users' }],
        },
        {
          name: 'onMarketplace',
          title: 'No Marketplace',
          type: 'string'
        },
        {
          name: 'type',
          title: 'Tipo',
          type: 'string'
        },
        {
          name: 'sold',
          title: 'Vendido',
          type: 'string'
        },
        {
          name: 'price',
          title: 'Preço',
          type: 'number'
        },
        {
          name: 'minBid',
          title: 'Lance Mínimo',
          type: 'number'
        },
      ],
    },
    {
      name: 'favorites',
      title: 'Favoritos',
      type: 'document',
      fields: [
        {
          name: 'contractAddress',
          title: 'Endereço do Contrato',
          type: 'string',
        },
        {
          name: 'tokenId',
          title: 'Token',
          type: 'string',
        },
        {
          name: 'user',
          title: 'Usuário',
          type: 'reference',
          to: [{ type: 'users' }],
        },
      ],
    },
  ]),
})
