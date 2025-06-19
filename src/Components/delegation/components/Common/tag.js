export const Tag = (Nr) => {
    let style = {
        back: '',
        text: '',
        content: ''
    };

    switch (Nr) {
        case -1:
            style = {
                back: '#BF242626',
                text: '#FF3336',
                content: 'Expired'
            }
            break;
        case 1:
            style = {
                back: '#24BF6A26',
                text: '#0AE598',
                content: 'Completed'
            }
            break;
        case 0:
            style = {
                back: '#BF9E2426',
                text: '#FFA629',
                content: 'Active'
            }
            break;
        default:
            style = {
                back: '',
                text: '',
                content: ''
            };
            break;
    }
    return (
        <div
            style={{
                backgroundColor: style.back,
                color: style.text,
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '22px',
                padding: '0 9px',
                borderRadius: 4
            }}
        >
            {style.content}
        </div>
    )
}
