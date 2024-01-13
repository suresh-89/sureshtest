export function QuestionDataFormat(response) {
    let data = [];
    let images = [];
    let audio = [];
    let type = "";
    let sub_question = [];
    let totalSubQuestion = [];
    let currentSubQuestionIndex = [];

    for (let i = 0; i < response.length; i++) {
        if (response[i].sub_question === undefined) {
            type = "type_1";
            images = [];
            audio = [];
            let videoTitle = "";
            let videoPath = "";
            totalSubQuestion.push(0);
            currentSubQuestionIndex.push(0);

            if (response[i].files && response[i].files.length !== 0) {
                // image
                if (response[i].files.type1_image_1) {
                    images.push({
                        title: response[i].files.type1_image_1_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type1_image_1,
                    });
                }
                if (response[i].files.type1_image_2) {
                    images.push({
                        title: response[i].files.type1_image_2_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type1_image_2,
                    });
                }
                if (response[i].files.type1_image_3) {
                    images.push({
                        title: response[i].files.type1_image_3_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type1_image_3,
                    });
                }
                if (response[i].files.type1_image_4) {
                    images.push({
                        title: response[i].files.type1_image_4_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type1_image_4,
                    });
                }

                // audio
                if (response[i].files.type1_audio_1) {
                    audio.push({
                        title: response[i].files.type1_audio_1_title,
                        file_name: "",
                        audio: null,
                        path: response[i].files.type1_audio_1,
                    });
                }
                if (response[i].files.type1_audio_2) {
                    audio.push({
                        title: response[i].files.type1_audio_2_title,
                        file_name: "",
                        audio: null,
                        path: response[i].files.type1_audio_2,
                    });
                }

                // video
                if (response[i].files.paste_video_url) {
                    videoPath = response[i].files.paste_video_url;
                }
                if (response[i].files.type1_video_1) {
                    videoPath = response[i].files.type1_video_1;
                }
                if (response[i].files.type1_video_1_title) {
                    videoTitle = response[i].files.type1_video_1_title;
                }
            }

            data.push({
                type: "type_1",
                question: response[i].question,
                question_random_id: response[i].question_random_id,
                pair_question_id: response[i].pair_question_id || "",
                favourite: response[i].favourite || false,
                personal_notes: response[i].personal_notes || {},
                content: {
                    mcq: response[i].mcq || false,
                    fill_in: response[i].fill_in || false,
                    boolean: response[i].boolean || false,
                    fillin_answer: response[i].fillin_answer
                        ? response[i].fillin_answer
                        : [],
                    boolean_question: response[i].boolean_question
                        ? response[i].boolean_question
                        : [],
                    options: response[i].options ? response[i].options : [],
                    mcq_answers: response[i].mcq_answers
                        ? response[i].mcq_answers
                        : 0,
                    explanation: response[i].explanation || "",
                    images: images.length !== 0 ? images : [],
                    video: {
                        title: videoTitle,
                        file_name: "",
                        video: null,
                        path: videoPath,
                        url: "",
                    },
                    audio: audio.length !== 0 ? audio : [],
                },
                properties: {
                    marks: response[i].properties
                        ? response[i].properties.marks
                        : "",
                    complexity: response[i].properties
                        ? response[i].properties.complexity
                        : "",
                    priority: response[i].properties
                        ? response[i].properties.priority
                        : "",
                    theme: response[i].properties
                        ? response[i].properties.theme
                        : "",
                    test: response[i].properties
                        ? response[i].properties.test
                        : "",
                    semester: response[i].properties
                        ? response[i].properties.semester
                        : "",
                    quiz: response[i].properties
                        ? response[i].properties.quiz
                        : "",
                    learn: response[i].properties
                        ? response[i].properties.learn
                        : "",
                },
                settings: {
                    virtual_keyboard: response[i].settings
                        ? response[i].settings.virtual_keyboard
                        : "",
                    limited: response[i].settings
                        ? response[i].settings.limited
                        : "",
                },
            });
        } else {
            type = "type_2";
            images = [];
            audio = [];
            let videoTitle = "";
            let videoPath = "";
            sub_question = [];
            totalSubQuestion.push(response[i].sub_question.length);
            currentSubQuestionIndex.push(0);

            // Image
            if (
                response[i].files &&
                Object.entries(response[i].files).length !== 0
            ) {
                if (response[i].files.type2_image_1) {
                    images.push({
                        title: response[i].files.type2_image_1_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type2_image_1,
                    });
                }
                if (response[i].files.type2_image_2) {
                    images.push({
                        title: response[i].files.type2_image_2_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type2_image_2,
                    });
                }
                if (response[i].files.type2_image_3) {
                    images.push({
                        title: response[i].files.type2_image_3_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type2_image_3,
                    });
                }
                if (response[i].files.type2_image_4) {
                    images.push({
                        title: response[i].files.type2_image_4_title,
                        file_name: "",
                        image: null,
                        path: response[i].files.type2_image_4,
                    });
                }

                // audio
                if (response[i].files.type2_audio_1) {
                    audio.push({
                        title: response[i].files.type2_audio_1_title,
                        file_name: "",
                        audio: null,
                        path: response[i].files.type2_audio_1,
                    });
                }
                if (response[i].files.type2_audio_2) {
                    audio.push({
                        title: response[i].files.type2_audio_2_title,
                        file_name: "",
                        audio: null,
                        path: response[i].files.type2_audio_2,
                    });
                }

                // video
                if (response[i].files.paste_video_url) {
                    videoPath = response[i].files.paste_video_url;
                }
                if (response[i].files.type2_video_1) {
                    videoPath = response[i].files.type2_video_1;
                }
                if (response[i].files.type2_video_1_title) {
                    videoTitle = response[i].files.type2_video_1_title;
                }
            }

            // Sub question
            for (let k = 0; k < response[i].sub_question.length; k++) {
                sub_question.push({
                    sub_question_id:
                        response[i].sub_question[k].sub_question_id,
                    question: response[i].sub_question[k].question,
                    mcq: response[i].sub_question[k].mcq || false,
                    fill_in: response[i].sub_question[k].fill_in || false,
                    fillin_answer: response[i].sub_question[k].fillin_answer
                        ? response[i].sub_question[k].fillin_answer
                        : [],
                    options: response[i].sub_question[k].options
                        ? response[i].sub_question[k].options
                        : [],
                    marks: response[i].sub_question[k].marks,
                    negative_marks: response[i].sub_question[k].negative_marks,
                });
            }

            // Main question
            data.push({
                type: "type_2",
                question: response[i].question,
                question_random_id: response[i].question_random_id,
                explanation: response[i].explanation || "",
                pair_question_id: response[i].pair_question_id || "",
                favourite: response[i].favourite || false,
                personal_notes: response[i].personal_notes || {},
                sub_question: sub_question,
                content: {
                    images: images.length !== 0 ? images : [],
                    video: {
                        title: videoTitle,
                        file_name: "",
                        video: null,
                        path: videoPath,
                        url: "",
                    },
                    audio: audio.length !== 0 ? audio : [],
                },
                properties: {
                    complexity: response[i].properties
                        ? response[i].properties.complexity
                        : "",
                    priority: response[i].properties
                        ? response[i].properties.priority
                        : "",
                    theme: response[i].properties
                        ? response[i].properties.theme
                        : "",
                    test: response[i].properties
                        ? response[i].properties.test
                        : "",
                    semester: response[i].properties
                        ? response[i].properties.semester
                        : "",
                    quiz: response[i].properties
                        ? response[i].properties.quiz
                        : "",
                    learn: response[i].properties
                        ? response[i].properties.learn
                        : "",
                },
                settings: {
                    virtual_keyboard: response[i].settings
                        ? response[i].settings.virtual_keyboard
                        : "",
                    limited: response[i].settings
                        ? response[i].settings.limited
                        : "",
                },
            });
        }
    }

    return {
        result: data,
        type: type,
        totalSubQuestion: totalSubQuestion,
        currentSubQuestionIndex: currentSubQuestionIndex,
    };
}

export function ConceptDataFormat(response) {
    let data = [];
    let images = [];
    let audio = [];

    for (let i = 0; i < response.length; i++) {
        images = [];
        audio = [];
        if (response[i].files && response[i].files.length !== 0) {
            // image
            if (response[i].files.concepts_image_1) {
                images.push({
                    title: response[i].files.concepts_image_1_title,
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_1,
                });
            }
            if (response[i].files.concepts_image_2) {
                images.push({
                    title: response[i].files.concepts_image_2_title,
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_2,
                });
            }
            if (response[i].files.concepts_image_3) {
                images.push({
                    title: response[i].files.concepts_image_3_title,
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_3,
                });
            }
            if (response[i].files.concepts_image_4) {
                images.push({
                    title: response[i].files.concepts_image_4_title,
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_4,
                });
            }

            // audio
            if (response[i].files.concepts_audio_1) {
                audio.push({
                    title: response[i].files.concepts_audio_1_title,
                    file_name: "",
                    audio: null,
                    path: response[i].files.concepts_audio_1,
                });
            }
            if (response[i].files.concepts_audio_2) {
                audio.push({
                    title: response[i].files.concepts_audio_2_title,
                    file_name: "",
                    audio: null,
                    path: response[i].files.concepts_audio_2,
                });
            }
        }

        // video
        var path = "";
        if (response[i].files && response[i].files.length !== 0) {
            if (response[i].files.paste_video_url) {
                path = response[i].files.paste_video_url;
            }
            if (response[i].files.concepts_video_1) {
                path = response[i].files.concepts_video_1;
            }
        }

        data.push({
            topic_num: response[i].topic_num,
            concepts_random_id: response[i].concepts_random_id,
            favourite: response[i].favourite || false,
            personal_notes: response[i].personal_notes || {},
            content: {
                terms: response[i].terms,
                definition: response[i].definition,
                images: images.length === 0 ? [] : images,
                video: {
                    title:
                        response[i].files &&
                        response[i].files.length !== 0 &&
                        response[i].files.concepts_video_1_title
                            ? response[i].files.concepts_video_1_title
                            : "",
                    file_name: "",
                    video: null,
                    path: path,
                    url: "",
                },
                audio: audio.length === 0 ? [] : audio,
            },
            settings: {
                virtual_keyboard: response[i].settings.virtual_keyboard,
                limited: response[i].settings.limited,
            },
        });
    }

    return { result: data };
}
