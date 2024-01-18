import { Breadcrumbs, styled } from '@mui/material'

export const BreadcrumbsStyled = styled(Breadcrumbs)(({ theme }) => ({
  ...theme.typography.caption
}))
