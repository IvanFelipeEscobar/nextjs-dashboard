import { Inter, Lusitana } from "next/font/google";
//Next optimizes fonts when using next/font module. it downloads fonts and hosts them w/ other static files

export const inter = Inter(
    { subsets: ["latin"] }
    );
export const lusitana = Lusitana({
    weight: ['400', '700'], 
    subsets: ['latin']
});

