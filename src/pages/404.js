import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import Img from 'gatsby-image'

import Layout from '../layouts'
import SEO from '../components/seo'
import BG from '../components/bg'


const StyledImage = styled(Img)`
  width: 1000;
  border-radius: 12px;
  margin-left: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.huge};
  @media (max-width: 960px) {
    width: 256px;
  }
`

const NotFoundPage = props => { 
  const data = useStaticQuery(graphql`
    {
      error: file(relativePath: { eq: "404page.png" }) {
        childImageSharp {
          fluid(quality: 100, maxWidth: 1000) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Layout path={props.location.pathname}>
      <BG />
      <SEO title="404: Not found" path={props.location.pathname} />
      <StyledImage fluid={data.error.childImageSharp.fluid} alt={"404 not found"} />
    </Layout>
  )
}

export default NotFoundPage
