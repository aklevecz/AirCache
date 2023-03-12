import Head from "next/head"
import { HuntMeta } from "../../libs/types"

type Props = {
  mapMeta:HuntMeta
}



export default function HeadHunt({mapMeta}:Props) {
  const head = mapMeta

    return (   head ?   <Head>
        <title>{head.name}</title>
        <meta property="og:title" content={head.name} />
        <meta property="og:description" content={head.description} />
        <meta property="og:image" content={head.image} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={head.image} />
        <meta name="twitter:title" content={head.name} />
        <meta name="twitter:text:title" content={head.name} />
      </Head> :<></>
)
}