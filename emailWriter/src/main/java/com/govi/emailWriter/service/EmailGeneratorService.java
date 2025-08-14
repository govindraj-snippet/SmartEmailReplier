package com.govi.emailWriter.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.govi.emailWriter.model.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient ;

    public EmailGeneratorService(WebClient.Builder webClientBuilder){
        this.webClient = webClientBuilder.build()  ;
    }

    private String geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=YOUR_API_KEY"
    ;

    private String geminiApiKey = "AIzaSyBG9WL9LTgNTY5_bssihIA6TeyHkCjVyro" ;  ;

    public String generateEmailReply(EmailRequest emailRequest){

        String prompt = buildPrompt(emailRequest) ;

        Map< String , Object > requestBody = Map.of(
                "contents" , new Object[]{
                        Map.of( "parts" , new Object[]{
                                Map.of("text" , prompt )
                        })
        }
        );

        String requestURL = geminiApiUrl.replace("YOUR_API_KEY" , geminiApiKey) ;

        String response = webClient.post()
                .uri(requestURL).header("Content-Type" , "application/json").bodyValue(requestBody)
                .retrieve().
                bodyToMono(String.class) .block() ;


        return extractResponseContent(response) ;



    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);


            JsonNode textNode = rootNode
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            return textNode.isMissingNode() ? "No text found in API response" : textNode.asText();

        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }


    private String buildPrompt( EmailRequest emailRequest){
        StringBuilder prompt = new StringBuilder() ;
        prompt.append("Generate a proffesional email reply for the following email content . please don't generate subject line  ");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){

            prompt.append("use a ").append(emailRequest.getTone()).append("tone");

        }
        prompt.append("\n Original email :  \n ").append(emailRequest.getEmailContent()) ;
        return prompt.toString() ;

    }

}
