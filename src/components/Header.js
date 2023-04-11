import { Typography, Box, useTheme } from "@mui/material";
import { fontWeight } from "@mui/system";
import { tokens } from "../theme";

const Header = ({ title, subtitle}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return <Box mb="30px">
        <Typography 
                variant="h1" 
                color={colors.grey[200]} 
                fontWeight="semi-bold" 
                sx={{ mb: "5px"}}> {title}
        </Typography>
        <Typography variant="h5" mt={2} color={colors.blueAccent[600]}>{subtitle}</Typography>
    </Box>
}

export default Header;