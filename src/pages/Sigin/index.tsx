import React, {useCallback, useRef, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {FiLogIn, FiMail, FiLock} from "react-icons/all";
import {Form} from '@unform/web'
import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'
import {useAuth} from "../../hooks/Auth";
import {useToast} from "../../hooks/Toast"


import {Container, Content, Background, AnimationContainer} from './styles'
import {FormHandles} from "@unform/core";
import * as Yup from "yup";
import getValidationErrors from "../../utils/getValidationsErros";


interface SigInFormData {
    email: string
    password: string
}

const SignIn: React.FC = () => {
    const {signIn} = useAuth();
    const {addToast} = useToast();
    const history = useHistory();

    const formRef = useRef<FormHandles>(null)
    const handleSubmit = useCallback(async (data: SigInFormData) => {
        try {
            formRef.current?.setErrors({})
            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('Senha obrigatória')
            });


            await schema.validate(data, {
                abortEarly: false
            })

            await signIn({
                email: data.email,
                password: data.password
            })

            history.push('/dashboard')
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);

                formRef.current?.setErrors(errors)
                return
            }
            addToast({
                type: 'error',
                title: 'Erro na autenticação',
                description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
            })
        }
    }, [signIn, addToast, history])


    return (<Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt="GoBarber"/>
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu login</h1>

                    <Input name="email" icon={FiMail} placeholder="E-mail"/>
                    <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>
                    <Button type="submit">Entrar</Button>
                    <a href="forgot">Esqueci minha senha</a>
                </Form>
                <Link to="/signup">
                    <FiLogIn/>
                    Criar Conta
                </Link>
            </AnimationContainer>
        </Content>
        <Background/>
    </Container>)
}

export default SignIn