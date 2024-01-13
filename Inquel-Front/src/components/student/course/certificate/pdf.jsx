import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import backgroundImage from "../../../../assets/blank-template-landscape.png";
import logo from "../../../../assets/logo.png";
import regularOpensans from "../../../../assets/fonts/OpenSans-Italic.ttf";
import boldItalicOpensans from "../../../../assets/fonts/OpenSans-SemiBoldItalic.ttf";
import boldOpensans from "../../../../assets/fonts/OpenSans-SemiBold.ttf";

// Register font
Font.register({
    family: "Open Sans",
    fonts: [
        {
            src: regularOpensans,
            fontStyle: "italic",
            fontWeight: 400,
        },
    ],
});
Font.register({
    family: "Open Sans",
    fonts: [
        {
            src: boldItalicOpensans,
            fontStyle: "italic",
            fontWeight: 600,
        },
    ],
});
Font.register({
    family: "Open Sans",
    fonts: [
        {
            src: boldOpensans,
            fontWeight: 600,
            fontStyle: "normal",
        },
    ],
});

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        width: "100%",
        orientation: "portrait",
    },

    imageView: {
        width: "100%",
        height: "100%",
        padding: 0,
    },
    image: {
        objectFit: "cover",
    },

    logo: {
        position: "absolute",
        top: "60px",
        right: "285px",
        width: "270px",
        height: "auto",
    },

    heading: {
        textAlign: "center",
        width: "100vw",
        color: "#621012",
        fontSize: "25px",
        letterSpacing: ".5px",
        textDecoration: "underline",
        fontFamily: "Open Sans",
        fontStyle: "italic",
        fontWeight: 600,
    },

    content: {
        textAlign: "center",
        lineHeight: "2.6px",
        letterSpacing: ".6px",
        width: "100%",
        fontFamily: "Open Sans",
        fontStyle: "italic",
        fontWeight: 400,
        color: "#621012",
        position: "relative",
        left: "-50%",
    },

    highlight: {
        fontFamily: "Open Sans",
        fontWeight: 600,
        fontStyle: "normal",
    },

    footer: {
        textAlign: "center",
        width: "100vw",
        color: "#ff6f38",
        letterSpacing: ".7px",
        fontFamily: "Open Sans",
        fontStyle: "italic",
        fontWeight: 600,
    },
});

const BackgroundImage = () => {
    return (
        <View style={styles.imageView}>
            <Image
                style={styles.image}
                src={backgroundImage}
                alt="background"
            />
        </View>
    );
};

const Logo = () => {
    return (
        <View>
            <Image src={logo} alt="logo" style={styles.logo} />
        </View>
    );
};

const Heading = () => {
    return (
        <View style={{ position: "absolute", top: "190px" }}>
            <Text style={styles.heading}>Certificate of Completion</Text>
        </View>
    );
};

const Content = (props) => {
    return (
        <View
            style={{
                position: "absolute",
                top: "48%",
                left: "50%",
                width: "62vw",
            }}
        >
            <Text style={styles.content}>
                This is to Certify that{" "}
                <Text style={styles.highlight}>
                    {props.certificate.student_full_name}
                </Text>{" "}
                successfully completed{" "}
                {props.certificate.course_completed === false ? (
                    <>
                        <Text style={styles.highlight}>
                            {props.certificate.chapters_completed <= 9
                                ? `0${props.certificate.chapters_completed}`
                                : props.certificate.chapters_completed}
                        </Text>
                        <Text> </Text>
                        <Text>chapters of</Text>
                        <Text> </Text>
                    </>
                ) : (
                    ""
                )}{" "}
                <Text style={styles.highlight}>
                    {props.certificate.course_name}
                </Text>{" "}
                online course on{" "}
                <Text
                    style={styles.highlight}
                >{`${props.certificate.month} ${props.certificate.date}, ${props.certificate.year}`}</Text>
            </Text>
        </View>
    );
};

const Footer = () => {
    return (
        <View style={{ position: "absolute", bottom: "30px" }}>
            <Text style={styles.footer}>IQ Labs Academy</Text>
        </View>
    );
};

const PDF = ({ course_name, certificate }) => {
    return (
        <Document
            title={course_name}
            subject="Certificate"
            creator="IQ Labs Academy"
            producer="IQ Labs Academy"
        >
            <Page object-fit="fill" style={styles.page} orientation="landscape">
                <BackgroundImage />
                <Logo />
                <Heading />
                <Content certificate={certificate} />
                <Footer />
            </Page>
        </Document>
    );
};

export default PDF;
