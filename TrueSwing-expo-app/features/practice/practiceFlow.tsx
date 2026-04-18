import { Text, View } from "react-native";

type Props = {
    analysisIssueId: string;
}

export default function PracticeFlow({analysisIssueId} : Props) {

    return (
        <View style={{ flex: 1 }}>
            <Text>Practice flow for issue {analysisIssueId}</Text>
         </View>
    )
}