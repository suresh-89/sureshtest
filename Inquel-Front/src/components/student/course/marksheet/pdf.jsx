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
import backgroundImage from "../../../../assets/blank-template.png";
import logo from "../../../../assets/logo.png";
import regularOpensans from "../../../../assets/fonts/OpenSans-Italic.ttf";
import boldItalicOpensans from "../../../../assets/fonts/OpenSans-SemiBoldItalic.ttf";
import boldOpensans from "../../../../assets/fonts/OpenSans-SemiBold.ttf";
import Table from "./table";
import dateFormat from "dateformat";

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
        top: "40px",
        right: "35px",
        width: "220px",
        height: "auto",
    },

    heading: {
        textAlign: "center",
        width: "100vw",
        color: "#621012",
        fontSize: 24,
        letterSpacing: ".5px",
        textDecoration: "underline",
        fontFamily: "Open Sans",
        fontStyle: "italic",
        fontWeight: 600,
    },

    footer: {
        width: "100vw",
        color: "#ff6f38",
        letterSpacing: ".7px",
        fontFamily: "Open Sans",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 16,
        marginLeft: 32,
    },
});

const BackgroundImage = () => {
    return (
        <View style={styles.imageView}>
            <Image style={styles.image} src={backgroundImage} alt="images" />
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
        <View style={{ position: "absolute", top: "130px" }}>
            <Text style={styles.heading}>Assessment Sheet</Text>
        </View>
    );
};

const NameView = (props) => {
    return (
        <View
            style={{
                position: "absolute",
                top: 205,
                width: "90%",
                left: "5%",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: "8px",
                }}
            >
                <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 12 }}>
                        Course: <Text>{props.course_name}</Text>
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            textAlign: "right",
                        }}
                    >
                        Date:{" "}
                        <Text>{dateFormat(new Date(), "mmmm dd, yyyy")}</Text>
                    </Text>
                </View>
            </View>
            <View>
                <Text style={{ fontSize: 12 }}>
                    Name: <Text>{props.profile.full_name}</Text>
                </Text>
            </View>
        </View>
    );
};

const Footer = () => {
    return (
        <View style={{ position: "absolute", bottom: 26 }}>
            <Text style={styles.footer}>IQ Labs Academy</Text>
        </View>
    );
};

const PDF = (props) => {
    return (
        <Document
            title={props.course_name}
            subject="Marksheet"
            creator="IQ Labs Academy"
            producer="IQ Labs Academy"
        >
            <Page object-fit="fill" style={styles.page}>
                <BackgroundImage />
                <Logo />
                <Heading />
                <NameView {...props} />
                <Table {...props} />
                <Footer />
            </Page>
        </Document>
    );
};

export default PDF;
